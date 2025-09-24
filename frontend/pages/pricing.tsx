import Head from 'next/head';

const plans = [
  {
    name: 'Startup',
    price: 'Free',
    description: 'Prototype without commitments. 100 voice minutes every month.',
    features: ['100 monthly voice minutes', '1 cloned voice', 'Community support', 'Webhook sandbox']
  },
  {
    name: 'Starter',
    price: '$249',
    description: 'Unlimited minutes with shared GPU autoscaling.',
    features: [
      'Unlimited voice minutes',
      '5 premium cloned voices',
      'Shared GPU autoscaling',
      'CRM & PSTN connectors'
    ]
  },
  {
    name: 'Pro',
    price: '$699',
    description: 'Production SLAs with dedicated Redis & Postgres.',
    features: [
      'Unlimited voice minutes',
      '15 premium cloned voices',
      'Dedicated VPC & database',
      '24/7 priority support'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Let’s talk',
    description: 'White-label, private GPU clusters, custom analytics and legal reviews.',
    features: [
      'Private GPU autoscaling with T4/A10G',
      'Dedicated success engineer',
      'Custom compliance & DPA',
      'Multi-tenant org hierarchies'
    ]
  }
];

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing - Brainy Voice Studio</title>
      </Head>
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="text-center">
          <h1 className="text-4xl font-black">Choose your growth lane</h1>
          <p className="mt-4 text-lg text-white/70">
            Mix freemium prototyping with consumption-based billing and optional white-label offerings.
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-3xl bg-white/5 p-6 shadow-xl backdrop-blur">
              <h2 className="text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-black text-accent">{plan.price}</p>
              <p className="mt-3 text-sm text-white/60">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-6 w-full bg-primary/80 hover:bg-primary">
                Select plan
              </button>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
