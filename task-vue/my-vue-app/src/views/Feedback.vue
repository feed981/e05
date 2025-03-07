<template>
   <div class="card">
      <h1 class="bhutuka-expanded-one-regular"><i class="fa-solid fa-envelope"></i> FEEDBACK!</h1>
      <form @submit.prevent="handleSubmit">
        <div class="input-container">
          <input type="email" v-model="formData.to_email" required placeholder="sender@example.com">
          <input type="text" style="margin-right: 0px;" v-model="formData.from_name" required
            placeholder="Enter your name...">
        </div>
        <div class="input-container">
          <textarea v-model="formData.message" required placeholder="Enter your message here..."></textarea>
        </div>
          <button class="font-awesome-i-inbutton" type="submit">
            <i title="Send your feedback mail!" class="font-awesome-i fa-solid fa-paper-plane"></i>
          </button>
        <div class="status" :class="{ error: isError }" v-if="status">{{ status }}</div>
      </form>
    </div>
</template>
  