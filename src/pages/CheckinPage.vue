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
            :checked="selectedSource === 'booking'"
            @change="() => selectSource('booking')" 
            class="mr-2 h-4 w-4 appearance-none checked:bg-blue-500 checked:border-transparent border border-gray-300 rounded focus:ring-blue-500"
          >
          <label for="other" class="text-gray-700">Booking.com</label>
        </div>

         <div class="flex items-center">
          <input 
            type="checkbox" 
            id="booking" 
            :checked="selectedSource === 'hotel'"
            @change="() => selectSource('hotel')" 
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
            class="w-full border border-gray-300 rounded-md p-2"
          >
        </div>
        <div>
          <h2 class="font-semibold mb-1">Check-out date</h2>
          <input 
            v-model="checkOut" 
            type="date" 
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
            class="w-full border border-gray-300 rounded-md p-2" 
            placeholder="$200"
          >
        </div>
        <div>
          <h2 class="font-semibold mb-1">Guest name</h2>
          <input 
            v-model="guestName" 
            type="text" 
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
        class="w-full border border-gray-300 rounded-md p-2"
      >
        <option disabled value="">Select a hotel or apartment</option>
        <option v-for="h in hotels" :key="h.id" :value="h.name">{{ h.name }}</option>
      </select>
    </div>

    <button 
      @click="submit" 
      class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
    >
      Submit
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase' 
import { collection, addDoc, getDocs } from 'firebase/firestore'

const selectedSource = ref('Airbnb')
const guestName = ref('')
const checkIn = ref('2024-04-24')
const checkOut = ref('2024-04-25')
const amount = ref('')
const hotel = ref('')
const reservationFile = ref(null)
const passportFile = ref(null)
const reservationFileInput = ref(null)
const passportFileInput = ref(null)
const hotels = ref([])

const selectSource = (source) => {
  selectedSource.value = source
}

const handleFileUpload = (event, type) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (type === 'reservation') {
    reservationFile.value = file
  } else {
    passportFile.value = file
  }
}

const fetchHotels = async () => {
  const snapshot = await getDocs(collection(db, 'hotels'))
  hotels.value = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name
  }))
}

onMounted(fetchHotels)

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'bookello_pics')
  
  const response = await fetch('https://api.cloudinary.com/v1_1/dpfkxvnln/image/upload', {
    method: 'POST',
    body: formData
  })
  
  const data = await response.json()
  return data.secure_url
}

const submit = async () => {
  if (!selectedSource.value || !guestName.value || !checkIn.value || 
      !checkOut.value || !hotel.value || !reservationFile.value || !passportFile.value) {
    alert("Please fill out all fields and upload both files.")
    return
  }

  const [reservationURL, passportURL] = await Promise.all([
    uploadToCloudinary(reservationFile.value),
    uploadToCloudinary(passportFile.value)
  ])

  await addDoc(collection(db, 'checkins'), {
    source: selectedSource.value,
    guestName: guestName.value,
    hotel: hotel.value,
    amount: amount.value,
    checkInDate: checkIn.value,
    checkOutDate: checkOut.value,
    reservationURL: reservationURL,
    passportURL: passportURL,
    completed: false,
    submittedAt: new Date()
  })

  alert("Check-in submitted successfully!")
  resetForm()
}

const resetForm = () => {
  selectedSource.value = 'Airbnb'
  guestName.value = ''
  checkIn.value = '2024-04-24'
  checkOut.value = '2024-04-25'
  amount.value = ''
  hotel.value = ''
  reservationFile.value = null
  passportFile.value = null
  
  if (reservationFileInput.value) {
    reservationFileInput.value.value = ''
  }
  if (passportFileInput.value) {
    passportFileInput.value.value = ''
  }
}
</script>