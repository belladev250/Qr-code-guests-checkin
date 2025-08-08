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

    <!-- Main Content -->
    <div class="lg:ml-64 p-4 md:p-8">
      <!-- Dashboard View -->
      <div v-if="!$route.hash || $route.hash === '#dashboard'">
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
                <option value="Bookello">Bookello.life</option>
                <option value="Booking.com">Booking.com</option>
                <option value="Agora">Agora</option>
                <option value="Expedia">Expedia</option>
                <option value="Hotel">Hotel.com</option>
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
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
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
                    <span>{{ guest.amount }}</span> <span>USD</span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      @click="viewDocument(guest.passportURL, 'passport', guest.id)" 
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
                      @click="viewDocument(guest.reservationURL, 'reservation', guest.id)" 
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

                    <button  @click="deleteCheckin(guest.id)" class="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded ml-2"
                     >
                      Delete
                     </button>

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
      </div>

      <!-- Staff Management View -->
      <div v-if="$route.hash === '#staff-management'">
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
                    <div v-if="staff.hotelIds && staff.hotelIds.length > 0">
                      <span class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ getHotelName(staff.hotelIds || staff.hotelId) }}
                      </span>
                    </div>
                    <span v-else>N/A</span>
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

        <!-- Empty State -->
        <div v-if="staffList.length === 0" class="bg-white shadow rounded-lg p-8 text-center mt-6">
          <p class="text-gray-500">No staff members found</p>
        </div>
      </div>

      <!-- Modals -->
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Assign Hotels</label>
              <select 
                v-model="staffForm.hotelIds" 
                multiple
                class="border rounded px-3 py-2 w-full h-auto min-h-[42px]">
                <option v-for="hotel in hotels" :value="hotel.id" :key="hotel.id">{{ hotel.name }}</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple hotels</p>
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
            <!-- Image Viewer -->
            <div v-if="activeDocument.fileType === 'image'" class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="max-w-full max-h-full overflow-auto p-4">
                <img 
                  :src="activeDocument.url" 
                  :alt="activeDocument.title"
                  class="max-w-full max-h-full object-contain shadow-lg rounded"
                  style="min-height: 200px;"
                  @error="$event.target.src = activeDocument.originalUrl"
                />
              </div>
            </div>
            
            <!-- PDF Viewer -->
            <div v-else-if="activeDocument.fileType === 'pdf'" class="w-full h-full">
              <iframe 
                :src="activeDocument.url" 
                class="w-full h-full border-0"
                frameborder="0"
              ></iframe>
            </div>
            
            <!-- Fallback for unknown file types -->
            <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
              <div class="text-center p-8">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                <p class="text-gray-500 mb-4">Cannot preview this file type in browser</p>
                <button 
                  @click="downloadDocument"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download to View
                </button>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t flex justify-between items-center">
            <div class="text-sm text-gray-500">
              Document Type: {{ activeDocument.type === 'passport' ? 'Passport/ID' : 'Reservation Confirmation' }}
              <span class="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                {{ activeDocument.fileType?.toUpperCase() }}
              </span>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="confirmDeleteDocument"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Document
              </button>
              <button 
                @click="window.open(activeDocument.originalUrl || activeDocument.url, '_blank')"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Open in New Tab
              </button>
              <button 
                @click="downloadDocument"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-flex items-center"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Document Confirmation Modal -->
      <div v-if="showDeleteDocumentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Confirm Document Deletion</h3>
            <button @click="showDeleteDocumentModal = false" class="text-gray-500 hover:text-gray-700">
              &times;
            </button>
          </div>
          <p class="mb-6">Are you sure you want to delete this {{ activeDocument.type === 'passport' ? 'passport/ID' : 'reservation' }} document? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteDocumentModal = false" 
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              @click="deleteDocument" 
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              :disabled="deleteDocumentLoading"
            >
              <span v-if="!deleteDocumentLoading">Delete Document</span>
              <span v-else>Deleting...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  collection, getDocs, getDoc, setDoc, doc,deleteDoc, 
  updateDoc, Timestamp
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, deleteUser, getAuth, signOut } from 'firebase/auth'
import { db, auth } from '@/firebase'
import { useRouter } from 'vue-router'

// State
const mobileSidebarOpen = ref(false)
const guests = ref([])
const hotels = ref([])
const staffList = ref([])
const loading = ref(false)
const bookingSource = ref('all')
const statusFilter = ref('all')
const showUserModal = ref(false)
const showDeleteModal = ref(false)
const showDeleteDocumentModal = ref(false)
const deleteLoading = ref(false)
const deleteDocumentLoading = ref(false)
const selectedStaffId = ref('')
const currentGuestId = ref('')

// Document Viewer
const activeDocument = ref({
  type: null,
  url: null,
  title: '',
  fileType: null,
  originalUrl: null
})

// Staff Form
const staffForm = ref({
  email: '',
  password: '',
  role: 'reception',
  hotelIds: []
})

const router = useRouter()

// Computed
const filteredGuests = computed(() => {
  return guests.value.filter(guest => {
    const sourceMatch = bookingSource.value === 'all' || 
                       guest.source === bookingSource.value
    const statusMatch = statusFilter.value === 'all' || 
                       guest.status === statusFilter.value
    return sourceMatch && statusMatch
  })
})

// Methods
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

const getFileType = (url) => {
  const lowercaseUrl = url.toLowerCase()
  if (lowercaseUrl.includes('.pdf') || lowercaseUrl.includes('pdf')) {
    return 'pdf'
  }
  if (lowercaseUrl.includes('.jpg') || lowercaseUrl.includes('.jpeg') || 
      lowercaseUrl.includes('.png') || lowercaseUrl.includes('.gif') || 
      lowercaseUrl.includes('.webp') || lowercaseUrl.includes('image')) {
    return 'image'
  }
  if (url.includes('cloudinary.com')) {
    if (url.includes('/image/') || url.includes('f_auto') || url.includes('q_auto')) {
      return 'image'
    }
    if (url.includes('/raw/') || url.includes('.pdf')) {
      return 'pdf'
    }
  }
  return 'image'
}

const formatDocumentUrl = (url, fileType) => {
  if (fileType === 'image') {
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
    }
    return url
  } else {
    if (url.includes('cloudinary.com')) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }
}

const viewDocument = (url, type, guestId) => {
  if (!url) {
    alert('Document not available')
    return
  }
  
  currentGuestId.value = guestId
  const fileType = getFileType(url)
  
  activeDocument.value = {
    type,
    url: formatDocumentUrl(url, fileType),
    originalUrl: url,
    title: type === 'passport' ? 'Passport/ID Document' : 'Reservation Confirmation',
    fileType
  }
}

const downloadDocument = () => {
  const downloadUrl = activeDocument.value.originalUrl || activeDocument.value.url
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = `${activeDocument.value.type}_document`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const confirmDeleteDocument = () => {
  showDeleteDocumentModal.value = true
}

const deleteDocument = async () => {
  try {
    deleteDocumentLoading.value = true
    
    const guestRef = doc(db, 'checkins', currentGuestId.value)
    const updateData = {}
    
    if (activeDocument.value.type === 'passport') {
      updateData.passportURL = null
    } else {
      updateData.reservationURL = null
    }
    
    await updateDoc(guestRef, updateData)
    await refreshGuests()
    
    showDeleteDocumentModal.value = false
    activeDocument.value.url = null
    
    alert('Document deleted successfully')
  } catch (error) {
    console.error('Error deleting document:', error)
    alert('Error deleting document: ' + error.message)
  } finally {
    deleteDocumentLoading.value = false
  }
}

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

const createStaff = async () => {
  if (staffForm.value.hotelIds.length === 0) {
    alert('Please select at least one hotel')
    return
  }

  try {
    loading.value = true
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      staffForm.value.email,
      staffForm.value.password
    )
    const user = userCredential.user
    
    await setDoc(doc(db, 'staff', user.uid), {
      uid: user.uid,
      email: staffForm.value.email,
      role: staffForm.value.role,
      hotelIds: Array.isArray(staffForm.value.hotelIds) 
        ? staffForm.value.hotelIds 
        : [staffForm.value.hotelIds].filter(Boolean),
      createdAt: Timestamp.now()
    })
    
    alert('Staff member created successfully!')
    showUserModal.value = false
    staffForm.value = {
      email: '',
      password: '',
      role: 'reception',
      hotelIds: []
    }
    await fetchStaff()
  } catch (error) {
    console.error("Error creating staff:", error)
    alert('Error creating staff: ' + error.message)
  } finally {
    loading.value = false
  }
}

const fetchStaff = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'staff'))
    staffList.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error loading staff:", error)
  }
}

const getHotelName = (hotelIds) => {
  if (!hotelIds) return 'N/A'
  
  if (Array.isArray(hotelIds)) {
    return hotelIds.map(id => {
      const hotel = hotels.value.find(h => h.id === id)
      return hotel ? hotel.name : 'Unknown Hotel'
    }).join(', ')
  }
  
  const hotel = hotels.value.find(h => h.id === hotelIds)
  return hotel ? hotel.name : 'Unknown Hotel'
}

const confirmDeleteStaff = (staffId) => {
selectedStaffId.value = staffId
showDeleteModal.value = true
}

const deleteStaff = async () => {
try {
deleteLoading.value = true
const staffDoc = await getDoc(doc(db, 'staff', selectedStaffId.value))

if (!staffDoc.exists()) {
  throw new Error('Staff record not found')
}

const staffData = staffDoc.data()

if (staffData.uid) {
  try {
    await deleteUser(await getAuth().getUser(staffData.uid))
  } catch (authError) {
    console.log("Auth user might be already deleted:", authError)
  }
}

await deleteDoc(doc(db, 'staff', selectedStaffId.value))

showDeleteModal.value = false
await fetchStaff()
alert('Staff member deleted successfully')
} catch (error) {
console.error('Error deleting staff:', error)
alert('Error deleting staff: ' + error.message)
} finally {
deleteLoading.value = false
}
}


const downloadReport = () => {
  // Create CSV headers
  const headers = '"Guest Name","Check-In Date","Booking Source","Hotel","Status"';
  
  // Create CSV rows from filtered guests
  const rows = filteredGuests.value.map((guest) => {
    return `"${guest.guestName}","${formatDate(guest.checkInDate)}","${guest.source}","${guest.hotel}","${guest.status}"`;
  }).join('\n');

  // Combine headers and rows
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'guest_checkins_report.csv');
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const logout = async () => {
try {
await signOut(auth)
router.push('/login')
} catch (error) {
console.error('Logout error:', error)
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
};

// Lifecycle hooks
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
  checkInDate: doc.data().checkInDate?.toDate?.() || doc.data().checkInDate
}))

hotels.value = hotelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
if (hotels.value.length > 0) {
  staffForm.value.hotelIds = [hotels.value[0].id]
}

await fetchStaff() 
} catch (error) {
console.error("Error loading data:", error)
} finally {
loading.value = false
}
})
</script>

<style scoped>
 .router-link-active { @apply bg-blue-700; } /* Custom scrollbar for document viewer */ ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; } ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #555; } </style>