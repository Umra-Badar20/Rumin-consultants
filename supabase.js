const supabaseUrl = window.__SUPABASE_URL__ || 'https://lmqcplgjlyungtbhsbvm.supabase.co'
const supabaseAnonKey = window.__SUPABASE_ANON_KEY__ || 'sb_publishable_VpCG4GznhxTwyN-dBtdkbQ_oQQImFhW'

if (!window.__SUPABASE_URL__ || !window.__SUPABASE_ANON_KEY__) {
  console.warn('Supabase credentials are missing. Add them before the script loads.')
}

var supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey)

async function loginAdmin(username, password) {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password')
      .eq('username', username)
      .single()

    if (error || !data) {
      throw new Error('Invalid username or password')
    }

    const isPasswordValid = await verifyPassword(password, data.password)
    if (!isPasswordValid) {
      throw new Error('Invalid username or password')
    }

    const token = btoa(`${data.id}:${data.username}:${Date.now()}`)
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin_id', data.id)

    return { success: true, token, adminId: data.id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

function logoutAdmin() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_id')
  return { success: true }
}

function getAdminToken() {
  return localStorage.getItem('admin_token')
}

function isAdminAuthenticated() {
  return !!localStorage.getItem('admin_token')
}

async function submitContact(contactData) {
  try {
    const safeAge = Number.parseInt(contactData.age, 10)
    
    // Truncate fields to match database schema constraints
    const payload = {
      name: String(contactData.name || '').trim().substring(0, 50),
      phone: String(contactData.phone || '').trim().substring(0, 20),
      age: Number.isNaN(safeAge) ? null : safeAge,
      qualification: String(contactData.qualification || '').trim().substring(0, 100),
      percentage: String(contactData.percentage || '').trim().substring(0, 10),
      english_test: String(contactData.englishTest || '').trim().substring(0, 100),
      country: String(contactData.country || '').trim().substring(0, 50),
      message: String(contactData.message || '').trim().substring(0, 500)
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert([payload])
      .select()

    if (error) throw error

    return { success: true, data: data && data[0] ? data[0] : null }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function getContacts() {
  try {
    const isAuth = isAdminAuthenticated()
    if (!isAuth) {
      throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function verifyPassword(password, hash) {
  return password === hash
}

window.ruminSupabase = {
  supabase,
  loginAdmin,
  logoutAdmin,
  getAdminToken,
  isAdminAuthenticated,
  submitContact,
  getContacts,
  verifyPassword
}

window.supabaseClient = supabase
