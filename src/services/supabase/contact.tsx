import { supabase } from "@/integrations/supabase/client"

interface Contact {
    fullName: string,
    email: string,
    message: string
}

export default function contact({fullName, email, message}: Contact) {
    const data = { fullName, email, message }

    return supabase.from('contact_messages').insert({
        full_name: data.fullName,
        email: data.email,
        message: data.message
    })
}