-- Seed data for local development and tests.
-- Runs after migrations on `supabase db reset` (see config.toml [db.seed]).
-- Keep this minimal: reference data only, not test fixtures.

insert into public.challenges (
  slug, title, category, difficulty, summary, challenge, description, description_code,
  starter_file, starter_code, editor_file, editor_code
) values
(
  'refactor-the-payment-processor',
  'Refactor the Payment Processor',
  'Behavioral',
  'Medium',
  'Replace a giant switch statement with the Strategy Pattern so new payment methods drop in cleanly.',
  'The Strategy Pattern',
  'The current {code} class uses a massive switch statement to handle Stripe, PayPal, and Crypto. Refactor this using the Strategy Pattern so new payment methods can be added without modifying the core class.',
  'Checkout',
  'checkout.ts',
  $$class Checkout {
  process(method: string, amount: number) {
    switch (method) {
      case "stripe":
        // ...charge via Stripe
        break
      case "paypal":
        // ...charge via PayPal
        break
      case "crypto":
        // ...charge via Crypto
        break
    }
  }
}$$,
  'checkout.ts',
  $$class Checkout {
  process(method: string, amount: number) {
    switch (method) {
      case "stripe":
        // ...charge via Stripe
        break
      case "paypal":
        // ...charge via PayPal
        break
      case "crypto":
        // ...charge via Crypto
        break
    }
  }
}$$
),
(
  'tame-the-notification-service',
  'Tame the Notification Service',
  'Behavioral',
  'Easy',
  'Let subscribers react to events without the publisher knowing about them, using the Observer Pattern.',
  'The Observer Pattern',
  'The {code} class calls email, SMS, and push code directly. Decouple it with the Observer Pattern so new channels can subscribe without editing the publisher.',
  'OrderService',
  'order-service.ts',
  $$class OrderService {
  placeOrder() {
    // ...persist order
    sendEmail()
    sendSMS()
    sendPush()
  }
}$$,
  'order-service.ts',
  $$class OrderService {
  placeOrder() {
    // ...persist order
    sendEmail()
    sendSMS()
    sendPush()
  }
}$$
),
(
  'build-a-widget-factory',
  'Build a Widget Factory',
  'Creational',
  'Medium',
  'Centralize object creation behind a Factory so callers stop newing up concrete classes everywhere.',
  'The Factory Pattern',
  'Callers construct {code} subclasses by hand with sprawling if/else blocks. Introduce a Factory so creation logic lives in one place.',
  'Button',
  'widgets.ts',
  $$function render(kind: string) {
  if (kind === "primary") return new PrimaryButton()
  else if (kind === "ghost") return new GhostButton()
  else if (kind === "danger") return new DangerButton()
}$$,
  'widgets.ts',
  $$function render(kind: string) {
  if (kind === "primary") return new PrimaryButton()
  else if (kind === "ghost") return new GhostButton()
  else if (kind === "danger") return new DangerButton()
}$$
),
(
  'one-config-to-rule-them-all',
  'One Config to Rule Them All',
  'Creational',
  'Easy',
  'Guarantee a single shared instance of app config with a well-behaved Singleton.',
  'The Singleton Pattern',
  'Every module creates its own {code}, so settings drift out of sync. Enforce a single shared instance with the Singleton Pattern.',
  'Config',
  'config.ts',
  $$export class Config {
  values: Record<string, string> = {}
}

// module A
const a = new Config()
// module B
const b = new Config() // different object!$$,
  'config.ts',
  $$export class Config {
  values: Record<string, string> = {}
}

// module A
const a = new Config()
// module B
const b = new Config() // different object!$$
),
(
  'wrap-the-legacy-api',
  'Wrap the Legacy API',
  'Structural',
  'Medium',
  'Make an incompatible third-party client fit your interface with the Adapter Pattern.',
  'The Adapter Pattern',
  'A legacy {code} exposes snake_case methods your app cannot call directly. Write an Adapter that presents the interface the rest of the code expects.',
  'LegacyGateway',
  'gateway.ts',
  $$class LegacyGateway {
  charge_card(cents: number) {
    // ...legacy call
  }
}

// app expects: gateway.pay(amount)$$,
  'gateway.ts',
  $$class LegacyGateway {
  charge_card(cents: number) {
    // ...legacy call
  }
}

// app expects: gateway.pay(amount)$$
),
(
  'decorate-your-coffee',
  'Decorate Your Coffee',
  'Structural',
  'Hard',
  'Add behavior to objects at runtime by stacking Decorators instead of subclassing.',
  'The Decorator Pattern',
  'Pricing a {code} with every combination of add-ons explodes into dozens of subclasses. Use the Decorator Pattern to compose behavior at runtime.',
  'Beverage',
  'coffee.ts',
  $$class EspressoWithMilkAndSugar {
  cost() {
    return 2.0 + 0.5 + 0.25
  }
}
// ...and a class for every combination$$,
  'coffee.ts',
  $$class EspressoWithMilkAndSugar {
  cost() {
    return 2.0 + 0.5 + 0.25
  }
}
// ...and a class for every combination$$
)
on conflict (slug) do nothing;
