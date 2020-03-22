<template>
  <div class="full-width-text-container">
    <h1>Information about Furway</h1>

    <p class="first-p">
      Furway is a Norwegian furry convention held outdoors. Some would say it’s a camping con, but with indoor sleeping capacity and modern toilets and showers, it’s more of a hybrid type of experience.
    </p>
    <p>
      Whether you love camping and hiking, or if you just want to experience just the right amount of wilderness alongside furry convention culture, Furway might be something to try out!

    </p>
    <p>
      The date for Furway 2020 is July 17th to July 19th. (16th to 20th with Early and Late tickets)
    </p>

    <img src="../assets/capri2.png" class="in-text-image"/>
    <label class="artwork-credit">
      Artwork by <a href="https://twitter.com/ArtWah">ArtWah</a>
    </label>

    <p style="margin-top: 10px;">
      This year, Furway will be held at a new venue: Åstjern hyttetun!
      <br>
      Åstjern consists of one main cabin, an annex and three smaller cabins. There’s also a bonfire place, of course! The lake Åstjernet is less than a 5-minute walk from the cabins.
    </p>
    <p>
      Registration opens March 1st 20:00 CET, and pre-registration for volunteers opens Feb 16th 20:00 CET. For more information regarding the registration process, see the <router-link :to="'/register'">Registration</router-link> page. Information about tickets and prices can be found below.
    </p>

    <p>
      <b>In order to register for Furway, you have to create an account on the website. You can do this at any time.</b>
    </p>

    <h3>Tickets and prices</h3>
    <table class="padded-table left-align very-wide-table" style="align-self: flex-start; margin: 0;">
      <tr>
        <th>Ticket type</th>
        <th>Inside spot (NOK)</th>
        <th>Outside spot (NOK)</th>
      </tr>
      <tr>
        <td>Standard ticket (3 days)</td>
        <td class="centered-td">{{conInfo.mainDaysInsidePriceNok}}</td>
        <td class="centered-td">{{conInfo.mainDaysOutsidePriceNok}}</td>
      </tr>
      <tr>
        <td class="left-pad-16"> + Early (4 days total)</td>
        <td class="centered-td">{{conInfo.mainDaysInsidePriceNok + conInfo.earlyArrivalPriceNok}}</td>
        <td class="centered-td">{{conInfo.mainDaysOutsidePriceNok + conInfo.earlyArrivalPriceNok}}</td>
      </tr>
      <tr>
        <td class="left-pad-16"> + Late (4 days total)</td>
        <td class="centered-td">{{conInfo.mainDaysInsidePriceNok + conInfo.lateDeparturePriceNok}}</td>
        <td class="centered-td">{{conInfo.mainDaysOutsidePriceNok + conInfo.lateDeparturePriceNok}}</td>
      </tr>
      <tr>
        <td class="left-pad-16"> + Early & Late (5 days total)</td>
        <td class="centered-td">{{conInfo.mainDaysInsidePriceNok + conInfo.earlyArrivalPriceNok + conInfo.lateDeparturePriceNok}}</td>
        <td class="centered-td">{{conInfo.mainDaysOutsidePriceNok + conInfo.earlyArrivalPriceNok + conInfo.lateDeparturePriceNok}}</td>
      </tr>
      <tr>
        <td>Single-day ticket</td>
        <td colspan="2" class="centered-td">{{conInfo.singeDayTicketPriceNok}}</td>
      </tr>
    </table>

    <h4>Standard ticket</h4>
    <p class="first-p">
       A three-day stay at the convention, including a place to sleep for two nights (whether inside or outside), as well as two breakfasts, two lunches and two dinners (see the section on food and servings for more on this).
    </p>

    <h4>Early ticket</h4>
    <p class="first-p">
      Arrival on Thursday the 16th (one day before the main days) and a place to sleep for that night, as well as one additional breakfast, lunch and dinner.
    </p>

    <h4>Late ticket</h4>
    <p class="first-p">
      Departure on Monday 20th (one day after the main days) and a place to sleep, as well as one additional breakfast and dinner. (Again, see the section on food and serving if this sounds confusing.)
    </p>

    <h4>Single day ticket</h4>
    <p class="first-p">
      Available only on the main days, this ticket includes single-day participation in convention activities, as well as transport to and from the train/bus station by the Furway transporters. Single-day tickets do not include any food, but you’re free to bring your own. Attendees with single day tickets must leave the convention area before 20:00 all days.
    </p>

    <p>
      Single day tickets will be available for purchase {{formatDateTimeWithoutYear(conInfo.singleDayTicketSaleOpenDate)}} - at this point, the waiting lists are not expected to change much, so people with spots in one of the lists can choose to give up their spot and secure themselves single day tickets instead. Note that if you're in a waiting list, and want to purchase single day tickets, you must delete your registration first. The number of single day tickets per day is limited to 19. 
    </p>

    <h3 id="facilities">Sleeping arrangements</h3>
    <p class="first-p">
      <i>You must be 18 or older to stay the night. People under the age of 18 may only purchase day tickets and can not spend the night at the convention.</i>
    </p>

    <h4>Inside</h4>
    <p class="first-p">
      Åstjern has 50 beds inside divided across various room sizes. It’s possible to rent bedding (duvet, pillow, sheets) for 150NOK, but it’s also possible to bring this yourself, to save money.
    </p>

    <h4>Outside</h4>
    <p class="first-p">
      We have capacity for 30 people sleeping outside in tents. (You may sleep in your car, but an Outside ticket is still required due to usage of the various facilities, electricity, etc.)  <b>You need to bring your own tent.</b>
    </p>
    <p class="no-margin-top">
      If you're bringing a van, please contact us in advance to make sure there's room. Power for your van costs 50 NOK per day.
    </p>

    <h4>Facilities</h4>
    <p class="first-p">
      Åstjern has fully equipped sanitary facilities, meaning several toilets and showers inside. These are in a common area. There's also electricity, so you'll be able to charge your electrical devices.
    </p>

    <h3>Where is Furway being held and how do I get there?</h3>
    <p class="first-p">
      If you’re driving there, the address is: Åstjerntunet, 2760 Brandbu (<a href="https://goo.gl/maps/n6rgg5nfWH3dyS3E6" target="_blank">Google Maps link</a>). There is a large parking lot available within walking distance from the venue, which should fit everyone.
    </p>

    <p>
      If you’re using public transportation the nearest train station is Bleiken, you can check <a href="https://www.vy.no/en" target="_blank">Vy.no</a> to plan your route. The nearest bus station is Brandbu skysstasjon, you can check <a href="https://ruter.no/en" target="_blank">Ruter.no</a> to plan your route. We’ll arrange for pick up, see below.
    </p>

    <p>
      If you arrive at the 16th, we have available drivers from 14:00 to 20:00. If you arrive at the 17th, we have available drivers from 12:00 to 20:00. For your departure our drivers are available from 12:00 – 20:00 on the 19th, and from 12:00 – 16:00 on the 20th. Please contact @Qupva on telegram <u>at least</u> 30 minutes before your arrival to arrange transportation.
    </p>

    <p>
      The times mentioned are important for the people in need transport from a bus/train station and back, please plan accordingly. If you’re traveling from far away and can’t choose an alternative within our driver’s schedule, let us know and we’ll sort out something for you – you’ll find a field when you register.
    </p>

    <h3 id="food">Food and serving</h3>
    <p class="first-p">
      Åstjern has a professional kitchen, and the Furway staff will cook and serve several meals every day. The table below shows which meals are included with the various ticket types.
    </p>
    <table class="very-wide-table" style="margin: 10px 0; align-self: flex-start;">
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

    <p>We recommend that you do all personal shopping beforehand, as there aren’t any stores within walking distance from the venue. Our drivers will do some trips to stores to buy essentials, but we can’t guarantee that you get a slot on one of these rides.</p>

    <h3>Deadlines & dates</h3>
    <div id="deadlines">
      <p class="first-p"><b>{{formatDateTimeWithoutYear(conInfo.volunteerRegistrationOpenDate)}}</b>: Registration opening for volunteers</p>
      <p><b>{{formatDateTimeWithoutYear(conInfo.registrationOpenDate)}}</b>: Registration opening</p>
      <p><b>{{formatDateTimeWithoutYear(conInfo.registrationCloseDate)}}</b>: Registration closing</p>
      <p><b>{{formatDateTimeWithoutYear(conInfo.originalPaymentDeadline)}}</b>: Payment deadline. Adding merch won't be possible after this. Any merch not paid by this time will be removed from your registration. If you haven't paid the main ticket price by this time, you will lose your spot. <i>If you receive a spot just after this deadline - because someone else didn't pay and lost theirs - you will be given an extended payment deadline.</i></p>
      <p><b>{{formatDateTimeWithoutYear(conInfo.singleDayTicketSaleOpenDate)}}</b>: Single day ticket sale opens</p>
      <p><b>{{formatDateTimeWithoutYear(conInfo.singleDayTicketSaleCloseDate)}}</b>: Single day ticket sale closes</p>
    </div>
  </div>  
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['conInfo'])
  },

  methods: {
    scrollTo (elementId) {
      document.getElementById(elementId).scrollIntoView()
    },

    formatDateTimeWithoutYear (dateTime) {
      dateTime = new Date(dateTime)
      return dateTime===null ? '' : dateTime.toDateString().substring(4,10) + ', ' + dateTime.toTimeString().substring(0,5)
    },
  }
}
</script>

<style lang="scss" scoped>
p {
  margin-top: 26px;
}
h4 {
  margin-top: 20px;
}
h3 {
  margin-top: 50px;
}
.first-p {
  margin-top: 0px;
}
#deadlines {
  p:not(.first-p){
    margin-top: 10px;
  }
}
</style>