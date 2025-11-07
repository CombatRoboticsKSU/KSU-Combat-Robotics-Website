<script lang="ts">
  let name: string = '';
  let email: string = '';
  let title: string = '';
  let msg: string = '';

  const sendEmail = async () => {
    try {
      const messageWithEmail = `${msg}\n\nSender Email: ${email}`;

      /*
      await emailjs.send(
        safeServiceId,
        safeTemplateId,
        {
          from_name: name,
          subject: title,
          message: messageWithEmail,
          reply_to: email
        },
        safeUserId
      );
      */

      alert('Email sent successfully!');
      name = '';
      email = '';
      title = '';
      msg = '';
    } catch (error) {
      console.error('Email send failed:', error);
    }
  };
</script>

<svelte:head>
  <title>Contact KSU Combat Robotics</title>
  <meta name="description" content="Linear series of events and milestones of our club" />
</svelte:head>

<header class="w-screen bg-black/10 text-white text-center py-16">
  <div class="container mx-auto">
    <h1 class="text-4xl font-bold mb-2">Contact Us</h1>
    <p class="text-lg opacity-90">
      Have questions or comments? Want to support us? Let us know!
    </p>
  </div>
</header>

<main class="flex justify-center items-center px-6 py-12">
  <div class="max-w-3xl w-full">
    <h4 class="text-xl font-semibold mb-6 text-center">
      Questions? Comments? Want to support us? Let us know!
    </h4>

    <form
      class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md flex flex-col gap-5"
      on:submit|preventDefault={sendEmail}
    >
      <div>
        <label class="block font-semibold mb-1 text-gray-700">Name:</label>
        <input
          type="text"
          bind:value={name}
          required
          class="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      <div>
        <label class="block font-semibold mb-1 text-gray-700">Email:</label>
        <input
          type="email"
          bind:value={email}
          required
          class="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      <div>
        <label class="block font-semibold mb-1 text-gray-700">Subject:</label>
        <input
          type="text"
          bind:value={title}
          required
          class="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      <div>
        <label class="block font-semibold mb-1 text-gray-700">Message:</label>
        <textarea
          bind:value={msg}
          required
          class="w-full p-3 border border-gray-300 rounded-md min-h-[100px] resize-y focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 transition transform active:scale-95"
      >
        Send
      </button>
    </form>
  </div>
</main>