import React from 'react'
import { IEvent } from '@/lib/mongodb/database/models/event.model';
import { Button } from '../ui/button';
import { checkoutOrder } from '@/lib/actions/order.actions';

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  const onCheckout = async () => {
    "use server";

    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    };

    await checkoutOrder(order);
  };

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  )
}

export default Checkout
