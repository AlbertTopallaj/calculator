async function mockPay(cardNumber, cvv, amount) {
    const request = await fetch("https://calc-payments.free.beeceptor.com/payment", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            card: {
                number: cardNumber,
                cvv: cvv
            },
            amount: amount
        })
    })

    const result = await request.json()

    if (result.success === true) {
        paymentSuccessful()
    } else {
        // Payment declined error handling
    }
}