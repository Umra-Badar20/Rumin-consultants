
const { createApp } = Vue;

createApp({
    data() {
        return {
            authenticated: false,
            inquiries: [],
            searchQuery: '',
            loginData: {
                username: '',
                password: ''
            },
            isLoading: false
        };
    },

    computed: {
        filteredInquiries() {
            const query = this.searchQuery.trim().toLowerCase();

            if (!query) return this.inquiries;

            return this.inquiries.filter(inquiry =>
                [
                    inquiry.name,
                    inquiry.phone,
                    inquiry.age,
                    inquiry.qualification,
                    inquiry.percentage,
                    inquiry.english_test,
                    inquiry.country,
                    inquiry.message
                ].some(value =>
                    String(value ?? '').toLowerCase().includes(query)
                )
            );
        }
    },

    async created() {
        this.isLoading = true;

        try {
            // Check the actual Supabase Auth session,
            // not the old localStorage admin token.
            const isAdmin =
                await window.ruminSupabase.isAdminAuthenticated();

            if (isAdmin) {
                this.authenticated = true;
                await this.fetchInquiries();
            }
        } catch (error) {
            console.error('Session verification failed:', error);
            this.authenticated = false;
        } finally {
            this.isLoading = false;
        }
    },

    methods: {
        formatDate(value) {
            if (!value) return 'N/A';

            const date = new Date(value);

            return Number.isNaN(date.getTime())
                ? 'N/A'
                : date.toLocaleDateString();
        },

        async login() {
            if (this.isLoading) return;

            this.isLoading = true;

            try {
                const result = await window.ruminSupabase.loginAdmin(
                    this.loginData.username,
                    this.loginData.password
                );

                if (!result.success) {
                    throw new Error(result.error || 'Login failed');
                }

                this.authenticated = true;

                this.loginData = {
                    username: '',
                    password: ''
                };

                await this.fetchInquiries();

                await Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome to the RuMin Consultants dashboard.',
                    confirmButtonColor: '#3085d6'
                });

            } catch (error) {
                this.authenticated = false;

                await Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message || 'Invalid email or password.',
                    confirmButtonColor: '#3085d6'
                });

            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            this.isLoading = true;

            try {
                const result = await window.ruminSupabase.logoutAdmin();

                if (!result.success) {
                    throw new Error(result.error || 'Logout failed');
                }

                this.authenticated = false;
                this.inquiries = [];
                this.searchQuery = '';

                await Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You have been logged out successfully.',
                    confirmButtonColor: '#3085d6'
                });

            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Logout Failed',
                    text: error.message,
                    confirmButtonColor: '#3085d6'
                });

            } finally {
                this.isLoading = false;
            }
        },

        async fetchInquiries() {
            this.isLoading = true;

            try {
                const result = await window.ruminSupabase.getContacts();

                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch inquiries');
                }

                this.inquiries = (result.data || []).map(inquiry => ({
                    ...inquiry,
                    createdAt: inquiry.created_at,
                    englishTest: inquiry.english_test
                }));

            } catch (error) {
                if (error.message.includes('Unauthorized')) {
                    this.authenticated = false;
                    this.inquiries = [];

                    await Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'Please log in with an authorized admin account.',
                        confirmButtonColor: '#3085d6'
                    });

                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Fetch Error',
                        text: 'Failed to load inquiries: ' + error.message,
                        confirmButtonColor: '#3085d6'
                    });
                }

            } finally {
                this.isLoading = false;
            }
        },

        async deleteInquiry(id) {
            const confirmation = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (!confirmation.isConfirmed) return;

            this.isLoading = true;

            try {
                const result = await window.ruminSupabase.deleteContact(id);

                if (!result.success) {
                    throw new Error(result.error || 'Deletion failed');
                }

                this.inquiries = this.inquiries.filter(
                    inquiry => inquiry.id !== id
                );

                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The inquiry has been deleted.',
                    confirmButtonColor: '#3085d6'
                });

            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: error.message || 'Failed to delete inquiry',
                    confirmButtonColor: '#3085d6'
                });

            } finally {
                this.isLoading = false;
            }
        }
    }
}).mount('#app');
