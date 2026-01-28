import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const event = req.body
        console.log('Webhook received:', event.meta?.event_name)

        // 결제 완료
        if (event.meta?.event_name === 'order_created') {
            const email = event.data?.attributes?.user_email

            const { data, error } = await supabase
                .from('subscribers')
                .upsert({ 
                    email: email, 
                    status: 'active' 
                }, { 
                    onConflict: 'email' 
                })

            if (error) {
                console.error('Supabase error:', error)
            } else {
                console.log('✅ 저장 완료:', email)
            }

            return res.status(200).json({ success: true })
        }

        // 구독 생성
        if (event.meta?.event_name === 'subscription_created') {
            const email = event.data?.attributes?.user_email

            const { data, error } = await supabase
                .from('subscribers')
                .upsert({ 
                    email: email, 
                    status: 'active' 
                }, { 
                    onConflict: 'email' 
                })

            if (error) {
                console.error('Supabase error:', error)
            } else {
                console.log('✅ 구독 저장:', email)
            }

            return res.status(200).json({ success: true })
        }

        return res.status(200).json({ success: true })

    } catch (error) {
        console.error('Webhook error:', error)
        return res.status(500).json({ error: 'Failed' })
    }
}
