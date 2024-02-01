export const prerender = false;

import type { APIRoute } from "astro";
import validateEmail from "../../lib/ValidateEmail";

export const GET: APIRoute =({ params, request}) => {
    return new Response(
        JSON.stringify({
            message:"this was a get"
        })
    );
};

export const POST: APIRoute = async ({ request }) => {

    try {

        const body = await request.json();
        const {email} = body;

        
        //check email exist
        if(!email){
            throw new Error("PLEASE provide email");
        }
        // validate email
        if(!validateEmail(email as string)){
            throw new Error("PLEASE provide email");
        }

        //check if email is aleready sub

        const subRes = await fetch(`https://api.convertkit.com/v3/subscribers?api_secret=${import.meta.env.CONVERT_KIT_SECRET_KEY}&email_address=${email}`);
        if(!subRes.ok) {
            throw new Error("Yikes!")
        }

        const subData = await subRes.json();
        const isSub = subData.total_subscribers >0;

        if(isSub){
            return new Response(
                JSON.stringify({
                    message: "Tu es deja abonné, merci!",
                }), {
                    status: 200,
                    statusText: "OK"
                }
            );
        }
        //subscribe email

        const res = await fetch("https://api.convertkit.com/v3/forms/6149473/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                api_key: import.meta.env.CONVERT_KIT_API_KEY, email,
            }),
        });

        if(!res.ok){
            throw new Error("big error")
        }

        const resText = await res.json();

        if(resText.error){
            throw new Error(resText.error.message);
        }

        return new Response(
            JSON.stringify({
                message: "Merci pour ton abonnement, check tes mails pour confirmer ton abonnement",
            }), {
                status: 200,
                statusText: "OK"
            }
        );
    }catch(e){
        if(e instanceof Error) {
            return new Response(null,{
                    status: 400,
                    statusText: e.message,
            });
        }
        return new Response(null,{
            status: 400,
            statusText: "unexpected error",
    });
    }


    return new Response(
        JSON.stringify({
            message:"this was a POST"
        })
    );
};