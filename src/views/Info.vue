<template>
  <div class="full-width-text-container left-aligned-text">
    <h1>Information about Furway</h1>
    <p class="first-p">
      A Norwegian furry con!
    </p>
    <p>
      17. - 19. July (16. - 20. July with Early and Late)
    </p>
    <p>
      This year, Furway will be held at a new venue: Åstjern! It consists of one main cabin, an annex and three smaller cabins. In the yard in the middle there’s a bonfire place. The lake Åstjernet is less than a five-minute walk from the cabins. We hope to see you there and that you’ll have a wonderful time!
    </p>
    <p>
      Registration opens March 1st.
      Prereg for volunteers opens Feb 16th. 
      For Information regarding tickets, pricing and registration, please go to the <router-link :to="'/register'">registration</router-link> page. 
    </p>

    <h3>Where is Furway being held and how do I get there?</h3>
    <p class="first-p">
      If you’re driving there its: Åstjerntunet, 2760 Brandbu (<a href="https://goo.gl/maps/n6rgg5nfWH3dyS3E6" target="_blank">Google Maps link</a>). There is a large parking lot available within walking distance from the venue, it should fit everyone

    <p>
      If you’re using public transportation the nearest train station is Bleiken, you can check <a href="https://www.vy.no/en" target="_blank">Vy.no</a> to plan your route. The nearest bus station is Brandbu skysstasjon, you can check <a href="https://ruter.no/en" target="_blank">Ruter.no</a> to plan your route. We’ll arrange for pick up, see below.
    </p>

    <p>
      If you arrive at the 16th, we have available drivers from 14:00 to 20:00. If you arrive at the 17th, we have available drivers from 12:00 to 20:00. For your departure our drivers are available from 12:00 – 20:00 on the 19th, and from 12:00 – 16:00 on the 20th. Please contact @Qupva on telegram <u>at least</u> 30 minutes before your arrival to arrange transportation.
    </p>

    <p>
      The times mentioned are important for the people in need transport from a bus/train station and back, please plan accordingly. If you’re traveling from far away and can’t choose an alternative within our driver’s schedule, let us know and we’ll sort out something for you – you’ll find a field when you register.
    </p>

    <h3>Sleeping and facilities</h3>
    <p class="first-p">
      <i>You must be 18 or older to stay the night. People under the age of 18 may only purchase day tickets and can not spend the night at the convention.</i>
    </p>

    <h4>Inside</h4>
    <p class="first-p">
      Åstjern has 50 beds inside divided across various room sizes. It’s possible to rent bedding (duvet, pillow, sheets) for 150NOK, but it’s also possible to bring this yourself, to save money.
    </p>

    <h4>Outside</h4>
    <p class="first-p">
      We have capacity for 30 people sleeping outside in tents. (You may sleep in your car, but an Outside ticket is still required due to usage of the various facilities, electricity, etc.)  You need to bring your own tent.
    </p>

    <h4>Facilities</h4>
    <p class="first-p">
      Åstjern has fully equipped sanitary facilities, meaning several toilets and showers inside. These are in a common area. There's also electricity, so you'll be able to charge your electrical devices.
    </p>

    <h3>Food and serving</h3>
    <p class="first-p">
      Åstjern has a professional kitchen, and the Furway staff will cook and serve several meals every day. The table below shows which meals are included with the various ticket types.
    </p>
    <table style="margin: 10px 0; align-self: flex-start;">
      <tr>
        <td class="th"></td>
        <td class="th">Thursday</td>
        <td class="th">Friday</td>
        <td class="th">Saturday</td>
        <td class="th">Sunday</td>
        <td class="th">Monday</td>
      </tr>
      <tr>
        <td class="th">Breakfast</td>
        <td></td>
        <td>Early</td>
        <td>Standard</td>
        <td>Standard</td>
        <td>Late</td>
      </tr>
      <tr>
        <td class="th">Lunch</td>
        <td></td>
        <td>Early</td>
        <td>Standard</td>
        <td>Late</td>
        <td></td>
      </tr>
      <tr>
        <td class="th">Dinner</td>
        <td>Early</td>
        <td>Standard</td>
        <td>Standard</td>
        <td>Late</td>
        <td></td>
      </tr>
    </table>
    <p class="first-p">
      Furway caters to specific dietary needs. You’ll find a field for entering this information when creating your user profile.
    </p>
  </div>  
</template>

<style lang="scss" scoped>
p, h4 {
  margin-top: 16px;
}
.first-p {
  margin-top: 0px;
}
</style>