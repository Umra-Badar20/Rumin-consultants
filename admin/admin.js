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
      if (!this.inquiries) return [];
      const query = this.searchQuery.toLowerCase();
      return this.inquiries.filter(inquiry => 
        (inquiry.name && inquiry.name.toLowerCase().includes(query)) ||
        (inquiry.phone && inquiry.phone.toLowerCase().includes(query)) ||
        (inquiry.age && inquiry.age.toString().includes(query)) ||
        (inquiry.qualification && inquiry.qualification.toLowerCase().includes(query)) ||
        (inquiry.percentage && inquiry.percentage.toLowerCase().includes(query)) ||
        (inquiry.english_test && inquiry.english_test.toLowerCase().includes(query)) ||
        (inquiry.country && inquiry.country.toLowerCase().includes(query))
      );
    }
  },
  async created() {
    const token = localStorage.getItem('admin_token');
    if (token) {
      this.authenticated = true;
      await this.fetchInquiries();
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return 'N/A';
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    },
    async login() {
      try {
        this.isLoading = true;
        const result = await window.ruminSupabase.loginAdmin(this.loginData.username, this.loginData.password);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        this.authenticated = true;
        this.loginData = { username: '', password: '' };
        await this.fetchInquiries();
        
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have been logged in successfully',
          confirmButtonColor: '#3085d6'
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.message || 'Invalid credentials',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      await window.ruminSupabase.logoutAdmin();
      this.authenticated = false;
      this.inquiries = [];
      
      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        confirmButtonColor: '#3085d6'
      });
    },
    async fetchInquiries() {
      try {
        this.isLoading = true;
        const result = await window.ruminSupabase.getContacts();
        
        if (!result.success) {
          throw new Error(result.error);
        }

        this.inquiries = (result.data || []).map((inquiry) => ({
          ...inquiry,
          createdAt: inquiry.createdAt || inquiry.created_at,
          englishTest: inquiry.englishTest || inquiry.english_test
        }));
      } catch (error) {
        if (error.message.includes('Unauthorized')) {
          this.authenticated = false;
          localStorage.removeItem('admin_token');
          await Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Please login again',
            confirmButtonColor: '#3085d6'
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Fetch Error',
            text: 'Failed to load inquiries: ' + error.message,
            confirmButtonColor: '#3085d6'
          });
          console.error('Error fetching inquiries:', error);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async deleteInquiry(id) {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        });
        
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Deleting...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });

          const { error } = await window.ruminSupabase.supabase
            .from('contacts')
            .delete()
            .eq('id', id);

          if (error) throw error;

          this.inquiries = this.inquiries.filter(inquiry => inquiry.id !== id);
          
          await Swal.fire(
            'Deleted!',
            'The inquiry has been deleted.',
            'success'
          );
        }
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error.message || 'Failed to delete inquiry',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  }
}).mount('#app');