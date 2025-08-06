<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-blue-800 text-white p-4 flex justify-between items-center z-50">
      <h1 class="text-xl font-bold">Reception Panel</h1>
      <button @click="mobileSidebarOpen = !mobileSidebarOpen" class="text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 w-64 bg-blue-800 text-white transform lg:translate-x-0 transition-transform duration-300 ease-in-out z-40"
      :class="{'translate-x-0': mobileSidebarOpen, '-translate-x-full': !mobileSidebarOpen}"
    >
      <div class="p-4 border-b border-blue-700">
        <h1 class="text-xl font-bold">Reception Panel</h1>
      </div>
      <nav class="p-4 space-y-2">
        <a 
          href="#dashboard" 
          class="block px-4 py-2 rounded bg-blue-700"
          @click="mobileSidebarOpen = false"
        >
          Dashboard
        </a>

        
       <button 
  @click="logout" 
  class="px-4 py-2 rounded hover:bg-blue-700 transition flex items-center w-full"
>
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </nav>
    </div>

    <!-- Overlay for mobile sidebar -->
    <div 
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <div class="lg:ml-64 p-4 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 class="text-2xl font-bold">Guest Check-Ins, {{ hotelName }}</h2>
        <button 
          @click="downloadReport" 
          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Report
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-wrap gap-4 items-end">
          <div class="w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="statusFilter" class="border rounded px-3 py-2 w-full sm:w-40">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="checked-in">Checked-In</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Guest Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport/ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="guest in filteredGuests" :key="guest.id">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ guest.guestName }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(guest.checkInDate) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(guest.checkOutDate) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ guest.source }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.passportURL, 'passport')" 
                    class="text-blue-600 hover:text-blue-900 mr-2"
                    :disabled="!guest.passportURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.passportURL}"
                  >
                    <span class="hidden sm:inline">View</span>
                    <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.reservationURL, 'reservation')" 
                    class="text-blue-600 hover:text-blue-900"
                    :disabled="!guest.reservationURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.reservationURL}"
                  >
                    <span class="hidden sm:inline">View</span>
                    <svg class="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </button>
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="statusClass(guest.status)">
                    {{ guest.status }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="markAsCheckedIn(guest.id)"
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded whitespace-nowrap"
                    v-if="guest.status === 'pending'"
                  >
                    Check In
                  </button>
                  <span v-else class="text-gray-500 whitespace-nowrap">
                    {{ formatTime(guest.checkedInAt) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredGuests.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
        <p class="text-gray-500">No guests found matching your filters</p>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="activeDocument.url" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col mx-4">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ activeDocument.title }}</h3>
            <button @click="activeDocument.url = null" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-hidden">
            <iframe :src="activeDocument.url" class="w-full h-full border-0" frameborder="0"></iframe>
          </div>
          
          <div class="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation Confirmation' }}
            </div>
            <div>
              <a 
                :href="activeDocument.url.includes('google.com') ? activeDocument.url.split('url=')[1] : activeDocument.url" 
                download
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center justify-center w-full sm:w-auto"
              >
                <svg class="w-5 h-5 mr-2 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, getDoc, doc, updateDoc, query, where } from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useRouter } from 'vue-router'

// Data
const guests = ref([])
const hotels = ref([])
const loading = ref(false)
const assignedHotel = ref('')
const router = useRouter()
const hotelName = ref('');


// Filters
const statusFilter = ref('all')

// Document viewing
const activeDocument = ref({
  type: null,
  url: null,
  title: ''
})


onMounted(async () => {
  try {
    const user = getAuth().currentUser;
    if (!user) return;
    
    // Get staff document
    const staffDoc = await getDoc(doc(db, 'staff', user.uid));
    if (staffDoc.exists()) {
      const hotelId = staffDoc.data().hotelId;
      
      // Get hotel document
      const hotelDoc = await getDoc(doc(db, 'hotels', hotelId));
      if (hotelDoc.exists()) {
        hotelName.value = hotelDoc.data().name;
      }
    }
  } catch (error) {
    console.error("Error fetching hotel name:", error);
  }
});

// Fetch data on mount
onMounted(async () => {
  loading.value = true
  try {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) {
      router.push('/login')
      return
    }

    // Get receptionist's assigned hotel
    const userDoc = await getDoc(doc(db, 'staff', user.uid))
    if (userDoc.exists()) {
      assignedHotel.value = userDoc.data().hotelId
    }

    // Fetch hotel name
    const hotelsSnapshot = await getDocs(collection(db, 'hotels'))
    hotels.value = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    // Fetch check-ins for assigned hotel
    if (assignedHotel.value) {
      const checkinsQuery = query(
        collection(db, 'checkins'),
        where('hotel', '==', getHotelName(assignedHotel.value))
      )
      const checkinsSnapshot = await getDocs(checkinsQuery)
      
      guests.value = checkinsSnapshot.docs.map(doc => {
        const data = doc.data()
        return { 
          id: doc.id, 
          ...data,
          // Ensure status is either 'pending' or 'checked-in'
          status: data.status === 'checked-in' ? 'checked-in' : 'pending',
          checkInDate: data.checkInDate?.toDate?.() || data.checkInDate,
          checkOutDate: data.checkOutDate?.toDate?.() || data.checkOutDate
        }
      })
    }
  } catch (error) {
    console.error("Error loading data:", error)
  } finally {
    loading.value = false
  }
})

// Computed properties
const filteredGuests = computed(() => {
  return guests.value.filter(guest => {
    return statusFilter.value === 'all' || guest.status === statusFilter.value
  })
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (dateString) => {
  if (!dateString) return 'Checked in'
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const statusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'checked-in': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getHotelName = (hotelId) => {
  const hotel = hotels.value.find(h => h.id === hotelId)
  return hotel ? hotel.name : ''
}

  

// Document viewing
const viewDocument = (url, type) => {
  if (!url) {
    alert('Document not available')
    return
  }
  
  activeDocument.value = {
    type,
    url: formatCloudinaryUrl(url),
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation'
  }
}

const formatCloudinaryUrl = (url) => {
  if (url.includes('cloudinary.com')) {
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
  }
  return url
}

// Mark guest as checked-in
const markAsCheckedIn = async (guestId) => {
  try {
    if (!confirm('Mark this guest as checked-in?')) return
    
    const now = new Date().toISOString()
    const userId = auth.currentUser?.uid
    
    await updateDoc(doc(db, 'checkins', guestId), {
      status: 'checked-in',
      checkedInAt: now,
      checkedInBy: userId
    })
    
    // Update local state
    guests.value = guests.value.map(guest => {
      if (guest.id === guestId) {
        return {
          ...guest,
          status: 'checked-in',
          checkedInAt: now,
          checkedInBy: userId
        }
      }
      return guest
    })
    
    alert('Guest successfully checked in')
  } catch (error) {
    console.error('Error checking in guest:', error)
    alert('Failed to check in guest: ' + error.message)
  }
}

// Report generation
const downloadReport = () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Guest Name,Check-In Date,Check-Out Date,Status,Checked-In At\n" +
    filteredGuests.value.map(guest => 
      `"${guest.guestName}","${formatDate(guest.checkInDate)}","${formatDate(guest.checkOutDate)}","${guest.status}","${guest.checkedInAt ? formatTime(guest.checkedInAt) : 'Not checked in'}"`
    ).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "guest_checkins_report.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const logout = async () => {
  try {
    await signOut(auth)
    this.mobileSidebarOpen = false;

    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-700;
}
</style>