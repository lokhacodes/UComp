import { NextResponse, NextRequest } from "next/server";
import { executePayment } from "@/lib/actions/bkash";
import { connectToDatabase } from "@/lib/mongodb/database";

connectToDatabase();


const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL!,
    username: process.env.BKASH_USERNAME!,
    password: process.env.BKASH_PASSWORD!,
    app_key: process.env.BKASH_APP_KEY!,
    app_secret: process.env.BKASH_APP_SECRET!,
};


export async function GET(req: NextRequest) {
    try {
        const query = req.nextUrl.searchParams;
        const paymentId = query.get("paymentID");
        const myUrl = req.nextUrl.origin;

        if (!paymentId) return NextResponse.redirect(`${myUrl}/cancel`, 303); // Redirect to the homepage

        const executePaymentResponse = await executePayment(bkashConfig, paymentId);

        if (!executePaymentResponse || executePaymentResponse.statusCode !== "0000") {
            return NextResponse.redirect(`${myUrl}/cancel`, 303); // Redirect to the homepage
        }

        return NextResponse.redirect(`${myUrl}/success`, 303); // Redirect to the homepage
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" });
    }
}
