export const prerender = false

import { useRef, useState } from "react";
import toast, {Toaster} from "react-hot-toast";
import validateEmail from "../lib/ValidateEmail";

const SubscribeForm = () => {
    const [isSubmitting, setIsSubmitting]= useState(false);
    const formRef = useRef<HTMLFormElement>(null);



    const handleSub = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        if(isSubmitting) return;
        setIsSubmitting(false);
        const subToast = toast.loading("Envoi...");


        const formData = new FormData(e.currentTarget);
        const formInputs = Object.fromEntries(formData);

        const email = formInputs.email;


        //email exists
        if (!email) {
            return toast.error("Merci de bien entrer une adresse mail", {
                id: subToast,
            });
        }

        //validate email
        if(!validateEmail((email as string).trim())){
            return toast.error("Merci de bien entrer une adresse mail valide", {
                id: subToast,
            });
            
        }
        
        try {
            const res = await fetch("/api/subscribe.json", {
                method: "POST",
                body: JSON.stringify(formInputs),
                headers: {
                    "Content-type": "application/json",
                },
            });

            if(!res.ok) {
                throw new Error("Merde");
            }

            const successMessage = await res.json();

            toast.success(successMessage.message, {
                id: subToast,
            });

            formRef.current?.reset();


            setIsSubmitting(false);
        } catch (e) {
            setIsSubmitting(false);
            toast.error("Un probleme est survenu merci de reessayer", {
                    id: subToast,
            });
            if (e instanceof Error) {
                return console.error(e.message);
            }
            console.error(e);
            }
        };



    return (
    <form ref={formRef} className="grid gap-2 p-4 border-2 border-theme-900 rounded-md" onSubmit={handleSub}>
        <label htmlFor="email" className="text-theme-900 text-lg">Entre ton email</label>
        <input className="bg-theme-base text-theme-900" type="email" name="email" id="email" required/>
        <button className="rounded-full bg-theme-200 max-w-32" type="submit" disabled={isSubmitting}>Envoyer
        </button>
        <Toaster 
        position="top-center"
        gutter={10}
        toastOptions={{
            duration: 5000,
            className: 'bg-theme-base text-theme-900',
        }}/>
    </form>
    );
};
export default SubscribeForm;