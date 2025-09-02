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
        <div class="text-sm mt-1">{{ currentUser?.email }}</div>
      </div>
      <nav class="p-4 space-y-2">
        <div class="px-4 py-2 rounded bg-blue-700">Dashboard</div>
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

    <!-- Overlay -->
    <div 
      v-if="mobileSidebarOpen"
      @click="mobileSidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="lg:ml-64 p-4 md:p-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div class="flex items-center gap-4">
          <h2 class="text-2xl font-bold">Guest Check-Ins</h2>
          <div v-if="assignedHotels.length > 1" class="relative">
            <select 
              v-model="currentHotelId" 
              @change="fetchCheckins"
              class="border rounded px-3 py-1 text-sm"
            >
              <option 
                v-for="hotel in assignedHotels" 
                :value="hotel.id" 
                :key="hotel.id"
              >
                {{ hotel.name }}
              </option>
            </select>
          </div>
          <span v-else-if="assignedHotels.length === 1" class="text-lg font-medium text-gray-700">
            {{ assignedHotels[0].name }}
          </span>
          <span v-else class="text-red-500 text-sm">No hotel assigned</span>
        </div>
        
        <button 
          @click="downloadReport" 
          class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
          :disabled="filteredAndSortedGuests.length === 0"
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
          <div class="w-full sm:w-auto">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search guest name..."
              class="border rounded px-3 py-2 w-full sm:w-64"
            >
          </div>
          <div class="w-full sm:w-auto">
            <button 
              @click="clearFilters"
              class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center p-8">
        <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Guest Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passport/ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reservation</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="guest in paginatedGuests" :key="guest.id">
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
                  {{ guest.amount }} USD
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.passportURL, 'passport')" 
                    class="text-blue-600 hover:text-blue-900"
                    :disabled="!guest.passportURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.passportURL}"
                  >
                    View
                  </button>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.reservationURL, 'reservation')" 
                    class="text-blue-600 hover:text-blue-900"
                    :disabled="!guest.reservationURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.reservationURL}"
                  >
                    View
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
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    v-if="guest.status === 'pending'"
                  >
                    Check In
                  </button>
                  <span v-else class="text-gray-500">
                    {{ formatTime(guest.checkedInAt) }}
                  </span>

                  <button 
                    @click="deleteCheckin(guest.id)"
                    class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between items-center">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredAndSortedGuests.length) }}</span> of 
              <span class="font-medium">{{ filteredAndSortedGuests.length }}</span> results
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700 mr-4">Rows per page:</span>
              <select 
                v-model="pageSize" 
                class="border rounded px-2 py-1 text-sm"
                @change="currentPage = 1"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  @click="currentPage--" 
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentPage === page 
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button 
                  @click="currentPage++" 
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredAndSortedGuests.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
        <p class="text-gray-500">
          {{ assignedHotels.length === 0 ? 'No hotel assigned to your account' : 'No guests found matching your filters' }}
        </p>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="activeDocument.url" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div class="p-4 border-b flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ activeDocument.title }}</h3>
            <button 
              @click="activeDocument.url = null" 
              class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-auto p-4">
            <img 
              v-if="activeDocument.fileType === 'image'" 
              :src="activeDocument.url" 
              :alt="activeDocument.title"
              class="max-w-full max-h-full object-contain mx-auto"
            />
            <iframe 
              v-else-if="activeDocument.fileType === 'pdf'"
              :src="`https://docs.google.com/gview?url=${encodeURIComponent(activeDocument.url)}&embedded=true`" 
              class="w-full h-full min-h-[70vh] border-0"
              frameborder="0"
            ></iframe>
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-gray-500 mb-4">Cannot preview this file type in browser</p>
                <button 
                  @click="downloadDocument"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
                >
                  Download Document
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation' }}
            </div>
            <div class="flex space-x-3">
              <button 
                @click="openInNewTab"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Open in New Tab
              </button>
              <button 
                @click="downloadDocument"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { 
  collection, getDocs, getDoc, doc, updateDoc, 
  query, where,deleteDoc
} from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useRouter } from 'vue-router'

// State
const mobileSidebarOpen = ref(false)
const loading = ref(true)
const guests = ref([])
const assignedHotels = ref([])
const currentHotelId = ref('')
const statusFilter = ref('all')
const searchQuery = ref('')
const activeDocument = ref({
  type: null,
  url: null,
  title: '',
  fileType: null
})
const currentUser = ref(null)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

const router = useRouter()

const filteredAndSortedGuests = computed(() => {
  const filtered = guests.value.filter(guest => {
    // Filter by status
    const statusMatch = statusFilter.value === 'all' || guest.status === statusFilter.value
    
    // Filter by search query
    let searchMatch = true
    if (searchQuery.value) {
      searchMatch = guest.guestName.toLowerCase().includes(searchQuery.value.toLowerCase())
    }
    
    return statusMatch && searchMatch
  })
  
  // Sort by check-in date (newest first)
  return filtered.sort((a, b) => {
    const dateA = getDateForSorting(a.checkInDate)
    const dateB = getDateForSorting(b.checkInDate)
    return dateB - dateA // Descending order (newest first)
  })
})

// Paginated guests
const paginatedGuests = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredAndSortedGuests.value.slice(startIndex, startIndex + pageSize.value)
})

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedGuests.value.length / pageSize.value)
})

// Visible pages for pagination
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  // Adjust if we're near the beginning
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for filter changes and reset to first page
watch([statusFilter, searchQuery], () => {
  currentPage.value = 1
})

// Helper function to normalize dates for sorting
const getDateForSorting = (date) => {
  if (!date) return new Date(0) // If no date, put at the end
  
  // Handle Firestore Timestamp objects
  if (date && typeof date.toDate === 'function') {
    return date.toDate()
  }
  
  // Handle Date objects
  if (date instanceof Date) {
    return date
  }
  
  // Handle string dates
  if (typeof date === 'string') {
    return new Date(date)
  }
  
  // Fallback
  return new Date(date || 0)
}

// Methods
const fetchUserData = async () => {
  try {
    const auth = getAuth()
    currentUser.value = auth.currentUser
    
    if (!currentUser.value) {
      router.push('/login')
      return
    }

    const userDoc = await getDoc(doc(db, 'staff', currentUser.value.uid))
    if (!userDoc.exists()) return

    const userData = userDoc.data()
    const hotelIds = Array.isArray(userData.hotelIds) 
      ? userData.hotelIds 
      : userData.hotelId ? [userData.hotelId] : []

    // Fetch hotel details
    const hotelPromises = hotelIds.map(id => getDoc(doc(db, 'hotels', id)))
    const hotelSnapshots = await Promise.all(hotelPromises)
    
    assignedHotels.value = hotelSnapshots
      .filter(snap => snap.exists())
      .map(snap => ({ id: snap.id, ...snap.data() }))
    
    currentHotelId.value = assignedHotels.value[0]?.id || ''
  } catch (error) {
    console.error("Error fetching user data:", error)
  }
}

const fetchCheckins = async () => {
  if (!currentHotelId.value) {
    guests.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    const currentHotel = assignedHotels.value.find(h => h.id === currentHotelId.value)
    if (!currentHotel) return

    const checkinsQuery = query(
      collection(db, 'checkins'),
      where('hotel', '==', currentHotel.name)
    )
    
    const checkinsSnapshot = await getDocs(checkinsQuery)
    guests.value = checkinsSnapshot.docs.map(doc => {
      const data = doc.data()
      return { 
        id: doc.id, 
        ...data,
        status: data.status === 'checked-in' ? 'checked-in' : 'pending',
        checkInDate: data.checkInDate?.toDate?.() || data.checkInDate,
        checkOutDate: data.checkOutDate?.toDate?.() || data.checkOutDate,
        checkedInAt: data.checkedInAt?.toDate?.() || data.checkedInAt // Convert Timestamp to Date
      }
    })
  } catch (error) {
    console.error("Error fetching check-ins:", error)
  } finally {
    loading.value = false
  }
}

const deleteCheckin = async (checkinId) => {
  if (!confirm('Are you sure you want to delete this check-in?')) return;
  
  try {
    await deleteDoc(doc(db, 'checkins', checkinId));
    
    // Remove from local state
    guests.value = guests.value.filter(guest => guest.id !== checkinId);
    
    alert('Check-in deleted successfully');
  } catch (error) {
    console.error('Error deleting check-in:', error);
    alert('Failed to delete check-in: ' + error.message);
  }
}

const markAsCheckedIn = async (guestId) => {
  if (!confirm('Mark this guest as checked-in?')) return
  
  try {
    const now = new Date() // Just use a regular JavaScript Date object
    await updateDoc(doc(db, 'checkins', guestId), {
      status: 'checked-in',
      checkedInAt: now, // Firestore will automatically convert this to a Timestamp
      checkedInBy: currentUser.value.uid
    })

    // Update local state with the same Date object
    guests.value = guests.value.map(guest => 
      guest.id === guestId 
        ? { ...guest, status: 'checked-in', checkedInAt: now }
        : guest
    )
  } catch (error) {
    console.error('Error checking in guest:', error)
    alert('Failed to check in guest: ' + error.message)
  }
}

const viewDocument = (url, type) => {
  if (!url) {
    alert('Document not available')
    return
  }
  
  const fileType = url.toLowerCase().includes('.pdf') ? 'pdf' : 'image'
  
  activeDocument.value = {
    type,
    url,
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation',
    fileType
  }
}

const openInNewTab = () => {
  window.open(activeDocument.value.url, '_blank')
}

const downloadDocument = () => {
  const link = document.createElement('a')
  link.href = activeDocument.value.url
  link.download = activeDocument.value.title.replace(/\s+/g, '_').toLowerCase()
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadReport = () => {
  const csvContent = "data:text/csv;charset=utf-8," +
    "Guest Name,Check-In Date,Check-Out Date,Status,Checked-In At\n" +
    filteredAndSortedGuests.value.map(guest => 
      `"${guest.guestName}","${formatDate(guest.checkInDate)}","${formatDate(guest.checkOutDate)}","${guest.status}","${guest.checkedInAt ? formatTime(guest.checkedInAt) : 'N/A'}"`
    ).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `guest_checkins_${currentHotelId.value}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const clearFilters = () => {
  statusFilter.value = 'all'
  searchQuery.value = ''
  currentPage.value = 1
}

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

// Helpers
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const statusClass = (status) => {
  return {
    'pending': 'bg-yellow-100 text-yellow-800',
    'checked-in': 'bg-green-100 text-green-800'
  }[status] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(async () => {
  await fetchUserData()
  await fetchCheckins()
})
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-700;
}
</style>