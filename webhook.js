// api/webhook.js
// Lemon Squeezy 결제 완료 시 호출됨

export default async function handler(req, res) {
    // POST 요청만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const event = req.body;

        console.log('Webhook received:', event);

        // 결제 완료 이벤트인지 확인
        if (event.meta?.event_name === 'order_created') {
            const email = event.data?.attributes?.user_email;
            const productName = event.data?.attributes?.first_order_item?.product_name;

            console.log(`✅ 새 결제! 이메일: ${email}, 상품: ${productName}`);

            // TODO: 여기서 Supabase에 유저 Pro 상태 저장
            // 지금은 일단 로그만

            return res.status(200).json({ 
                success: true, 
                message: `결제 처리 완료: ${email}` 
            });
        }

        // 구독 관련 이벤트
        if (event.meta?.event_name === 'subscription_created') {
            const email = event.data?.attributes?.user_email;
            console.log(`✅ 새 구독! 이메일: ${email}`);

            return res.status(200).json({ 
                success: true, 
                message: `구독 처리 완료: ${email}` 
            });
        }

        // 기타 이벤트는 그냥 OK 응답
        return res.status(200).json({ success: true, message: 'Event received' });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
}
