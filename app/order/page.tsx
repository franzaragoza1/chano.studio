import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Watermark from '@/components/Watermark'
import OrderForm from '@/components/OrderForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Place Your Order | Chano Studio',
  description: 'Submit your track for professional mixing and mastering at Chano Studio.',
}

export default function OrderPage() {
  return (
    <>
      <Watermark />
      <Header />
      <main>
        <section id="order-form-section">
          <div className="container">
            <h2>PLACE YOUR ORDER</h2>
            <OrderForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
