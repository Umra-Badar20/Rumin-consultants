
/**
 * RuMin Consultants
 * Secure Supabase Integration
 *
 * Supabase Auth for administrators
 * Row Level Security for database access
 * Public contact form submissions
 */

(function () {
    'use strict';

    // Supabase project configuration
    // These values will be set in the next step.
    const supabaseUrl = window.__SUPABASE_URL__;
    const supabaseAnonKey = window.__SUPABASE_ANON_KEY__;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error(
            'Supabase configuration is missing. Check the project URL and publishable key.'
        );
        return;
    }

    if (!window.supabase || !window.supabase.createClient) {
        console.error('Supabase JavaScript SDK is not loaded.');
        return;
    }

    const supabase = window.supabase.createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        }
    );

    // =========================================
    // CHECK APPROVED ADMIN
    // =========================================

    async function getApprovedAdmin() {
        const { data: authData, error: authError } =
            await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return null;
        }

        const user = authData.user;

        const { data, error } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        return data ? user : null;
    }

    // =========================================
    // ADMIN LOGIN
    // =========================================

    async function loginAdmin(email, password) {
        try {
            const safeEmail = String(email || '').trim();
            const safePassword = String(password || '');

            if (!safeEmail || !safePassword) {
                throw new Error(
                    'Please enter your email and password.'
                );
            }

            const { error } =
                await supabase.auth.signInWithPassword({
                    email: safeEmail,
                    password: safePassword
                });

            if (error) {
                throw error;
            }

            const admin = await getApprovedAdmin();

            if (!admin) {
                await supabase.auth.signOut();

                throw new Error(
                    'Access denied. This account is not an authorized administrator.'
                );
            }

            return {
                success: true,
                adminId: admin.id,
                email: admin.email
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =========================================
    // ADMIN LOGOUT
    // =========================================

    async function logoutAdmin() {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) throw error;

            // Clean up tokens created by the old login system
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_id');

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =========================================
    // CHECK ADMIN SESSION
    // =========================================

    async function isAdminAuthenticated() {
        try {
            const admin = await getApprovedAdmin();
            return Boolean(admin);
        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    }

    // =========================================
    // SUBMIT CONTACT FORM
    // =========================================

    async function submitContact(contactData) {
        try {
            const safeAge =
                Number.parseInt(contactData.age, 10);

            const payload = {
                name: String(contactData.name || '')
                    .trim()
                    .substring(0, 50),

                phone: String(contactData.phone || '')
                    .trim()
                    .substring(0, 20),

                age: Number.isNaN(safeAge)
                    ? null
                    : safeAge,

                qualification: String(
                    contactData.qualification || ''
                ).trim().substring(0, 100),

                percentage: String(
                    contactData.percentage || ''
                ).trim().substring(0, 10),

                english_test: String(
                    contactData.englishTest || ''
                ).trim().substring(0, 100),

                country: String(contactData.country || '')
                    .trim()
                    .substring(0, 50),

                message: String(contactData.message || '')
                    .trim()
                    .substring(0, 500)
            };

            // Do not use .select() here.
            // Public users have INSERT permission only.
            const { error } = await supabase
                .from('contacts')
                .insert([payload]);

            if (error) throw error;

            return {
                success: true
            };

        } catch (error) {
            console.error('Contact submission failed:', error);

            return {
                success: false,
                error: error.message
            };
        }
    }

    // =========================================
    // FETCH CONTACT ENQUIRIES
    // =========================================

    async function getContacts() {
        try {
            const admin = await getApprovedAdmin();

            if (!admin) {
                throw new Error('Unauthorized');
            }

            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', {
                    ascending: false
                });

            if (error) throw error;

            return {
                success: true,
                data: data || []
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =========================================
    // DELETE CONTACT ENQUIRY
    // =========================================

    async function deleteContact(id) {
        try {
            const admin = await getApprovedAdmin();

            if (!admin) {
                throw new Error('Unauthorized');
            }

            const { data, error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id)
                .select('id');

            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error(
                    'Enquiry was not deleted. Check permissions.'
                );
            }

            return { success: true };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =========================================
    // GLOBAL EXPORTS
    // =========================================

    window.ruminSupabase = {
        supabase,
        loginAdmin,
        logoutAdmin,
        isAdminAuthenticated,
        submitContact,
        getContacts,
        deleteContact
    };

    window.supabaseClient = supabase;

})();
