/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HIZBuCMVlMUoiYyIMArL2QaLhIiVtRqzwv9elEiWMyhSIUjmILhRJoze78zFJh6kLrnen3Cm9cZh2xdi12kxS6L005wjzoCVN'
);

export const bookTour = async (tourID) => {
  try {
    //1) Get the session from server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourID}`
    );
    console.log(session);

    //2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);

    showAlert('error', err);
  }
};
