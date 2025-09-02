<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-300">
    <h1 class="text-2xl font-bold mb-6 text-center">Self Check-In System</h1>
    
    <div class="mb-6">
      <h2 class="font-semibold mb-3">Upload Your Reservation</h2>
      <div class="space-y-2">
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="bookello" 
            :checked="selectedSource === 'Bookello'"
            @change="() => selectSource('Bookello')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="bookello" class="text-gray-700">Bookello.life</label>
        </div>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="agora" 
            :checked="selectedSource === 'Agora'"
            @change="() => selectSource('Agora')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="agora" class="text-gray-700">Agora</label>
        </div>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="expedia" 
            :checked="selectedSource === 'Expedia'"
            @change="() => selectSource('Expedia')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="expedia" class="text-gray-700">Expedia</label>
        </div>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="booking" 
            :checked="selectedSource === 'Booking.com'"
            @change="() => selectSource('Booking.com')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="booking" class="text-gray-700">Booking.com</label>
        </div>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            id="hotel" 
            :checked="selectedSource === 'Hotel.com'"
            @change="() => selectSource('Hotel.com')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="hotel" class="text-gray-700">Hotel.com</label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h2 class="font-semibold mb-3">Upload reservation confirmation</h2>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <p class="text-gray-500">Choose file or drag it here</p>
        <input 
          type="file" 
          @change="handleFileUpload($event, 'reservation')" 
          class="hidden" 
          id="reservationFile"
          ref="reservationFileInput"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        >
        <label for="reservationFile" class="block mt-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 cursor-pointer hover:bg-gray-200">
          Select File
        </label>
        <p v-if="reservationFile" class="text-sm mt-2 text-gray-600 font-medium">
          📄 {{ reservationFile.name }}
        </p>
      </div>
    </div>

    <div class="mb-6">
      <h2 class="font-semibold mb-3">Upload your passport or ID</h2>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
        <p class="text-gray-500">Upload identity</p>
        <input 
          type="file" 
          @change="handleFileUpload($event, 'passport')" 
          class="hidden" 
          id="passportFile"
          ref="passportFileInput"
          accept=".pdf,.jpg,.jpeg,.png"
        >
        <label for="passportFile" class="block mt-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 cursor-pointer hover:bg-gray-200">
          Select File
        </label>
        <p v-if="passportFile" class="text-sm mt-2 text-gray-600 font-medium">
          🆔 {{ passportFile.name }}
        </p>
      </div>
    </div>

    <div class="mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h2 class="font-semibold mb-1">Check-in date</h2>
          <input 
            v-model="checkIn" 
            type="date" 
            required
            class="w-full border border-gray-300 rounded-md p-2"
          >
        </div>
        <div>
          <h2 class="font-semibold mb-1">Check-out date</h2>
          <input 
            v-model="checkOut" 
            type="date" 
            required
            class="w-full border border-gray-300 rounded-md p-2"
          >
        </div>
      </div>
    </div>

    <div class="mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h2 class="font-semibold mb-1">Amount</h2>
          <input 
            v-model="amount" 
            type="text" 
            required
            class="w-full border border-gray-300 rounded-md p-2" 
            placeholder="$200"
          >
        </div>
        <div>
          <h2 class="font-semibold mb-1">Guest name</h2>
          <input 
            v-model="guestName" 
            type="text" 
            required
            class="w-full border border-gray-300 rounded-md p-2" 
            placeholder="John Doe"
          >
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h2 class="font-semibold mb-1">Hotel or apartment name</h2>
      <select 
        v-model="hotel" 
        required
        class="w-full border border-gray-300 rounded-md p-2"
      >
        <option disabled value="">Select a hotel or apartment</option>
        <option v-for="h in hotels" :key="h.id" :value="h.name">{{ h.name }}</option>
      </select>
    </div>

    <!-- New Payment Method Field -->
    <div class="mb-6">
      <h2 class="font-semibold mb-1">Payment Method</h2>
      <div class="flex space-x-4">
        <div class="flex items-center">
          <input 
            type="radio" 
            id="cash" 
            value="cash" 
            v-model="paymentMethod"
            class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
          >
          <label for="cash" class="text-gray-700">Cash</label>
        </div>
        <div class="flex items-center">
          <input 
            type="radio" 
            id="card" 
            value="card" 
            v-model="paymentMethod"
            class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
          >
          <label for="card" class="text-gray-700">Credit/Debit Card</label>
        </div>
      </div>
    </div>

    <!-- Error message display -->
    <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ errorMessage }}
    </div>

    <!-- Success message display -->
    <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
      {{ successMessage }}
    </div>

    <button 
      @click="submit" 
      :disabled="isLoading"
      class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
    >
      <div v-if="isLoading" class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </div>
      <span v-else>Submit</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase' 
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Reactive data
const selectedSource = ref('')
const guestName = ref('')
const checkIn = ref('')
const checkOut = ref('')
const amount = ref('')
const hotel = ref('')
const paymentMethod = ref('cash') // Default to cash
const reservationFile = ref(null)
const passportFile = ref(null)
const reservationFileInput = ref(null)
const passportFileInput = ref(null)
const hotels = ref([])

// Loading and message states
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Initialize dates to today and tomorrow
onMounted(() => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  checkIn.value = today.toISOString().split('T')[0]
  checkOut.value = tomorrow.toISOString().split('T')[0]
  
  fetchHotels()
})

const selectSource = (source) => {
  selectedSource.value = source
  errorMessage.value = '' // Clear any previous errors
}

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = 'File size must be less than 10MB'
    return
  }
  
  if (type === 'reservation') {
    reservationFile.value = file
  } else {
    passportFile.value = file
  }
  
  errorMessage.value = '' // Clear any previous errors
}

const fetchHotels = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'hotels'))
    hotels.value = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }))
  } catch (error) {
    console.error('Error fetching hotels:', error)
    errorMessage.value = 'Failed to load hotels. Please refresh the page.'
  }
}

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'bookello_pics')
  
  const response = await fetch('https://api.cloudinary.com/v1_1/dpfkxvnln/image/upload', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Failed to upload file')
  }
  
  const data = await response.json()
  return data.secure_url
}

const sendEmailNotification = async (checkinData) => {
  try {
    // Using EmailJS to send the notification
    const emailData = {
      service_id: 'service_y0cbytl', // Replace with your EmailJS service ID
      template_id: 'template_n7hbnwm', // Replace with your EmailJS template ID
      user_id: 'FtJ9t4rF-3-dGoVJn', // Replace with your EmailJS user ID
      template_params: {
        to_email: 'melissaineza8@gmail.com',
        guest_name: checkinData.guestName,
        hotel: checkinData.hotel,
        
      }
    };

    // Send email using EmailJS
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      console.warn('Email notification failed, but form submission was successful');
    }
  } catch (error) {
    console.warn('Email notification error:', error);
    // Don't throw error here - we don't want email failures to affect form submission
  }
}



const validateForm = () => {
  errorMessage.value = ''
  
  // Check required fields
  if (!selectedSource.value) {
    errorMessage.value = 'Please select a booking source.'
    return false
  }
  
  if (!guestName.value.trim()) {
    errorMessage.value = 'Please enter guest name.'
    return false
  }
  
  if (!checkIn.value) {
    errorMessage.value = 'Please select check-in date.'
    return false
  }
  
  if (!checkOut.value) {
    errorMessage.value = 'Please select check-out date.'
    return false
  }
  
  if (!amount.value.trim()) {
    errorMessage.value = 'Please enter the amount.'
    return false
  }
  
  if (!hotel.value) {
    errorMessage.value = 'Please select a hotel or apartment.'
    return false
  }
  
  if (!paymentMethod.value) {
    errorMessage.value = 'Please select a payment method.'
    return false
  }
  
  if (!reservationFile.value) {
    errorMessage.value = 'Please upload reservation confirmation.'
    return false
  }
  
  if (!passportFile.value) {
    errorMessage.value = 'Please upload passport or ID.'
    return false
  }
  
  // Validate dates
  if (new Date(checkOut.value) <= new Date(checkIn.value)) {
    errorMessage.value = 'Check-out date must be after check-in date.'
    return false
  }
  
  return true
}

const submit = async () => {
  // Validate form before submission
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    // Upload files to Cloudinary
    const [reservationURL, passportURL] = await Promise.all([
      uploadToCloudinary(reservationFile.value),
      uploadToCloudinary(passportFile.value)
    ])

    // Prepare data object with all fields properly populated
    const checkinData = {
      source: selectedSource.value,
      guestName: guestName.value.trim(),
      hotel: hotel.value,
      amount: amount.value.trim(),
      checkInDate: checkIn.value,
      checkOutDate: checkOut.value,
      paymentMethod: paymentMethod.value,
      reservationURL: reservationURL,
      passportURL: passportURL,
      reservationFileName: reservationFile.value.name,
      passportFileName: passportFile.value.name,
      completed: false,
      submittedAt: new Date().toISOString(), // Use ISO string for consistency
      status: 'pending'
    }

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'checkins'), checkinData)
    console.log('Document written with ID: ', docRef.id)

    // Send email notification (this runs in background, doesn't affect form submission)
    sendEmailNotification(checkinData).catch(error => {
      console.warn('Email notification failed:', error);
    });

    successMessage.value = "Check-in submitted successfully! We'll process it shortly."
    
    // Redirect to payment page if paying by card
    if (paymentMethod.value === 'card') {
      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        window.location.href = 'https://shop.directpay.online/paymybills/KIGALIFANTASTICAPARTMENT'
      }, 1500)
    } else {
      // Reset form after successful submission for cash payments
      setTimeout(() => {
        resetForm()
        successMessage.value = ''
      }, 3000)
    }

  } catch (error) {
    console.error('Error submitting check-in:', error)
    errorMessage.value = 'Failed to submit check-in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  selectedSource.value = ''
  guestName.value = ''
  amount.value = ''
  hotel.value = ''
  paymentMethod.value = 'cash' // Reset to default
  reservationFile.value = null
  passportFile.value = null
  errorMessage.value = ''
  successMessage.value = ''
  
  // Reset file inputs
  if (reservationFileInput.value) {
    reservationFileInput.value.value = ''
  }
  if (passportFileInput.value) {
    passportFileInput.value.value = ''
  }
  
  // Reset dates to today and tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  checkIn.value = today.toISOString().split('T')[0]
  checkOut.value = tomorrow.toISOString().split('T')[0]
}
</script>