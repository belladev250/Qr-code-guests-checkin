
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed top-0 left-0 right-0 bg-blue-800 text-white p-4 flex justify-between items-center z-50">
      <h1 class="text-xl font-bold">Admin Panel</h1>
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
        <h1 class="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav class="p-4 space-y-2">
        <a 
          href="#dashboard"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition"
          :class="{ 'bg-blue-700': $route.hash === '#dashboard' }"
          @click="mobileSidebarOpen = false"
        >
          Dashboard
        </a>
        <a 
          href="#staff-management"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition"
          :class="{ 'bg-blue-700': $route.hash === '#staff-management' }"
          @click="mobileSidebarOpen = false"
        >
          Manage Staff
        </a>
        <button 
          @click="logout"
          class="block px-4 py-2 rounded hover:bg-blue-700 transition flex items-center w-full"
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

    <div class="lg:ml-64 p-4 md:p-8" v-if="!$route.hash || $route.hash === '#dashboard'">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 class="text-2xl font-bold">Guest Check-Ins</h2>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            @click="showUserModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
          >
            + Create Staff
          </button>
          <button 
            @click="downloadReport"
            class="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download Report
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Booking Source</label>
            <select v-model="bookingSource" class="border rounded px-3 py-2 w-full">
              <option value="all">All</option>
              <option value="Bookello">Bookello</option>
              <option value="Booking.com">Booking.com</option>
              <option value="Airbnb">Airbnb</option>
              <option value="Expedia">Expedia</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="statusFilter" class="border rounded px-3 py-2 w-full">
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <span class="hidden sm:inline">View Passport</span>
                  </button>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    @click="viewDocument(guest.reservationURL, 'reservation')" 
                    class="text-blue-600 hover:text-blue-900"
                    :disabled="!guest.reservationURL"
                    :class="{'opacity-50 cursor-not-allowed': !guest.reservationURL}"
                  >
                    <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span class="hidden sm:inline">View Reservation</span>
                  </button>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ guest.hotel }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="statusClass(guest.status)">
                    {{ guest.status }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="approveGuest(guest.id)"
                    class="text-green-600 hover:text-green-900 mr-3"
                    v-if="guest.status === 'pending'"
                  >
                    Approve
                  </button>
                  <button 
                    @click="rejectGuest(guest.id)"
                    class="text-red-600 hover:text-red-900"
                    v-if="guest.status === 'pending'"
                  >
                    Reject
                  </button>
                  <span v-if="guest.status !== 'pending'" class="text-gray-500">
                    Processed
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

      <!-- Create Staff Modal -->
      <div v-if="showUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Create Staff Member</h3>
            <button @click="showUserModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <form @submit.prevent="createStaff">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="staffForm.email" type="email" class="border rounded w-full px-3 py-2" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input v-model="staffForm.password" type="password" class="border rounded w-full px-3 py-2" required>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="staffForm.role" class="border rounded w-full px-3 py-2" required>
                <option value="reception">Receptionist</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Assign Hotel</label>
              <select v-model="staffForm.hotelId" class="border rounded w-full px-3 py-2" required>
                <option v-for="hotel in hotels" :value="hotel.id" :key="hotel.id">
                  {{ hotel.name }}
                </option>
              </select>
            </div>
            <div class="flex justify-end space-x-3">
              <button type="button" @click="showUserModal = false" class="px-4 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
                Create Staff
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Document Viewer Modal -->
      <div v-if="activeDocument.url" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
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
          
          <div class="flex-1 overflow-hidden">
            <iframe 
              :src="activeDocument.url" 
              class="w-full h-full border-0"
              frameborder="0"
            ></iframe>
          </div>
          
          <div class="p-4 border-t flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation Confirmation' }}
            </div>
            <div>
              <a 
                :href="activeDocument.url.includes('google.com') ? activeDocument.url.split('url=')[1] : activeDocument.url" 
                download
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Staff Management -->
    <div v-if="$route.hash === '#staff-management'" class="lg:ml-64 p-4 md:p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 class="text-2xl font-bold">Staff Management</h2>
      </div>

      <!-- Staff Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="staff in staffList" :key="staff.id">
                <td class="px-4 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ staff.email }}</div>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-purple-100 text-purple-800': staff.role === 'super_admin',
                      'bg-blue-100 text-blue-800': staff.role === 'hotel_admin',
                      'bg-green-100 text-green-800': staff.role === 'reception'
                    }">
                    {{ staff.role }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getHotelName(staff.hotelId) || 'N/A' }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    @click="confirmDeleteStaff(staff.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Staff Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Confirm Deletion</h3>
            <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p class="mb-6">Are you sure you want to delete this staff member? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false" 
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="deleteStaff" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="deleteLoading"
            >
              <span v-if="!deleteLoading">Delete</span>
              <span v-else>Deleting...</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="staffList.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
        <p class="text-gray-500">No staff members found</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  collection, getDocs,getDoc,getAuth, setDoc, doc, 
  updateDoc, Timestamp
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';


// Data
const guests = ref([])
const hotels = ref([])
const showUserModal = ref(false)
const loading = ref(false)

const router = useRouter();
// Add these imports if not already present


// Add these state variables
const staffList = ref([]);
const showDeleteModal = ref(false);
const selectedStaffId = ref('');
const deleteLoading = ref(false);
// const editingStaff = ref(null);


// Filters
const bookingSource = ref('all')
const statusFilter = ref('all')

// Staff Form
const staffForm = ref({
  email: '',
  password: '',
  role: 'hotel_admin',
  hotelId: ''
})

// Fetch data on mount
onMounted(async () => {
  loading.value = true
  try {
    const [guestsSnapshot, hotelsSnapshot] = await Promise.all([
      getDocs(collection(db, 'checkins')),
      getDocs(collection(db, 'hotels'))
    ])
    
    guests.value = guestsSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Convert Firestore Timestamp to Date if needed
      checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate
    }))
    
    hotels.value = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    if (hotels.value.length > 0) {
      staffForm.value.hotelId = hotels.value[0].id
    }
  } catch (error) {
    console.error("Error loading data:", error)
  } finally {
    loading.value = false
  }
})




const logout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
// Computed properties
const filteredGuests = computed(() => {
  return guests.value.filter(guest => {
    // Filter by time range
    let dateMatch = true
    
  
    
    // Filter by booking source
    const sourceMatch = bookingSource.value === 'all' || 
                       guest.source === bookingSource.value
    
    // Filter by status
    const statusMatch = statusFilter.value === 'all' || 
                       guest.status === statusFilter.value
    
    return dateMatch && sourceMatch && statusMatch
  })
})

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const statusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Document viewing
const activeDocument = ref({
  type: null, // 'passport' or 'reservation'
  url: null,
  title: ''
});

const viewDocument = (url, type) => {
  if (!url) {
    alert('Document not available');
    return;
  }
  
  activeDocument.value = {
    type,
    url: formatCloudinaryUrl(url),
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation'
  };
};

const formatCloudinaryUrl = (url) => {
  if (url.includes('cloudinary.com')) {
    // Use Google Docs viewer for Cloudinary PDFs
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
};


// Guest management
const approveGuest = async (guestId) => {
  try {
    await updateDoc(doc(db, 'checkins', guestId), {
      status: 'approved',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser.uid
    })
    refreshGuests()
  } catch (error) {
    console.error("Error approving guest:", error)
  }
}

const rejectGuest = async (guestId) => {
  try {
    await updateDoc(doc(db, 'checkins', guestId), {
      status: 'rejected',
      processedAt: Timestamp.now(),
      processedBy: auth.currentUser.uid
    })
    refreshGuests()
  } catch (error) {
    console.error("Error rejecting guest:", error)
  }
}

const refreshGuests = async () => {
  const snapshot = await getDocs(collection(db, 'checkins'))
  guests.value = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate
  }))
}

// Staff management
const createStaff = async () => {
  try {
    loading.value = true;
    
    // 1. Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      staffForm.value.email,
      staffForm.value.password
    );
    const user = userCredential.user;
    
    // 2. Save to Firestore
    await setDoc(doc(db, 'staff', user.uid), {
      uid: user.uid,
      email: staffForm.value.email,
      role: staffForm.value.role,
      hotelId: staffForm.value.hotelId,
      createdAt: Timestamp.now()
    });
    
    alert('Staff member created successfully!');
    showUserModal.value = false;
    staffForm.value = {
      email: '',
      password: '',
      role: 'hotel_admin',
      hotelId: hotels.value[0]?.id || ''
    };
    await fetchStaff(); // Refresh the staff list
  } catch (error) {
    console.error("Error creating staff:", error);
    alert('Error creating staff: ' + error.message);
  } finally {
    loading.value = false;
  }
};

// Add these methods to your script
const fetchStaff = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'staff'));
    staffList.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error loading staff:", error);
  }
};

const getHotelName = (hotelId) => {
  const hotel = hotels.value.find(h => h.id === hotelId);
  return hotel ? hotel.name : '';
};



const confirmDeleteStaff = (staffId) => {
  selectedStaffId.value = staffId;
  showDeleteModal.value = true;
};

const deleteStaff = async () => {
  try {
    deleteLoading.value = true;
    
    // 1. Get staff data before deleting
    const staffDoc = await getDoc(doc(db, 'staff', selectedStaffId.value));
    
    if (!staffDoc.exists()) {
      throw new Error('Staff record not found');
    }

    const staffData = staffDoc.data();
    
    // 2. Delete from Auth first (if UID exists)
    if (staffData.uid) {
      try {
        await deleteUser(await getAuth().getUser(staffData.uid));
      } catch (authError) {
        console.log("Auth user might be already deleted:", authError);
      }
    }
    
    // 3. Delete from Firestore
    await deleteDoc(doc(db, 'staff', selectedStaffId.value));
    
    showDeleteModal.value = false;
    await fetchStaff();
    alert('Staff member deleted successfully');
  } catch (error) {
    console.error('Error deleting staff:', error);
    alert('Error deleting staff: ' + error.message);
  } finally {
    deleteLoading.value = false;
  }
};

// Call fetchStaff when component mounts
onMounted(fetchStaff);

// Report generation
const downloadReport = () => {
  // This would be more sophisticated in a real app
  const csvContent = "data:text/csv;charset=utf-8," +
    "Guest Name,Check-In Date,Booking Source,Hotel,Status\n" +
    filteredGuests.value.map(guest => 
      `"${guest.guestName}","${formatDate(guest.checkInDate)}","${guest.source}","${guest.hotel}","${guest.status}"`
    ).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "guest_checkins_report.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.router-link-active {
  @apply bg-blue-700;
}
</style>