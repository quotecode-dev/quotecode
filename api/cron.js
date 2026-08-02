import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // בדיקת הצעות מחיר שתוקפן פג היום ושטרם נשלחה להן תזכורת
    const { data: expiringQuotes, error: quotesError } = await supabase
      .from('quotes')
      .select('id, valid_until, clients(email, company_name)')
      .eq('expiration_reminder_sent', false)
      .eq('valid_until', today);

    if (quotesError) throw quotesError;

    // סימון בבסיס הנתונים שהתזכורת בוצעה
    if (expiringQuotes && expiringQuotes.length > 0) {
      for (const quote of expiringQuotes) {
        await supabase
          .from('quotes')
          .update({ expiration_reminder_sent: true })
          .eq('id', quote.id);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Cron executed successfully. Processed ${expiringQuotes?.length || 0} quotes.` 
    });
  } catch (error) {
    console.error('Cron job error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}