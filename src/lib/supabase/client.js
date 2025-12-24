import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

console.log("Supabase URL present:", !!supabaseUrl);
console.log("Supabase Key present:", !!supabaseKey);

// Create a dummy client if creds are missing to prevent app crash
const createSupabaseClient = () => {
    if (!supabaseUrl || !supabaseKey) {
        console.warn("Supabase credentials missing! App running in limited mode.");
        return {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null } }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithPassword: () => Promise.resolve({ error: { message: "Database not connected" } }),
                signOut: () => Promise.resolve({ error: null }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve({ data: [], error: null }),
                        single: () => Promise.resolve({ data: null, error: null }),
                        limit: () => Promise.resolve({ data: [], error: null }),
                    }),
                    order: () => ({
                        limit: () => Promise.resolve({ data: [], error: null }),
                    }),
                }),
                insert: () => Promise.resolve({ error: { message: "Database not connected" } }),
                update: () => ({ eq: () => Promise.resolve({ error: { message: "Database not connected" } }) }),
                delete: () => ({ eq: () => Promise.resolve({ error: { message: "Database not connected" } }) }),
            })
        };
    }
    return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();

