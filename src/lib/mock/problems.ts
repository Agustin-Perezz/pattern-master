export type Difficulty = "Easy" | "Medium" | "Hard";

export type Problem = {
  slug: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  challenge: string;
  description: string;
  descriptionCode?: string;
  starterFile: string;
  starterCode: string;
  editorFile: string;
  editorCode: string;
};

export const CATEGORIES = ["Behavioral", "Creational", "Structural"] as const;

export type ProblemDifficulty = Difficulty;

export const PROBLEMS: Problem[] = [
  {
    slug: "refactor-the-payment-processor",
    title: "Refactor the Payment Processor",
    category: "Behavioral",
    difficulty: "Medium",
    summary:
      "Replace a giant switch statement with the Strategy Pattern so new payment methods drop in cleanly.",
    challenge: "The Strategy Pattern",
    description:
      "The current {code} class uses a massive switch statement to handle Stripe, PayPal, and Crypto. Refactor this using the Strategy Pattern so new payment methods can be added without modifying the core class.",
    descriptionCode: "Checkout",
    starterFile: "checkout.ts",
    starterCode: `class Checkout {
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
}`,
    editorFile: "checkout.ts",
    editorCode: `interface IPaymentStrategy {
  pay(amount: number): void
}

class StripeStrategy implements IPaymentStrategy {
  pay(amount: number) {
    // charge via Stripe
  }
}

class PayPalStrategy implements IPaymentStrategy {
  pay(amount: number) {
    // charge via PayPal
  }
}

class Checkout {
  constructor(private strategy: IPaymentStrategy) {}

  process(amount: number) {
    this.strategy.pay(amount)
  }
}`,
  },
  {
    slug: "tame-the-notification-service",
    title: "Tame the Notification Service",
    category: "Behavioral",
    difficulty: "Easy",
    summary:
      "Let subscribers react to events without the publisher knowing about them, using the Observer Pattern.",
    challenge: "The Observer Pattern",
    description:
      "The {code} class calls email, SMS, and push code directly. Decouple it with the Observer Pattern so new channels can subscribe without editing the publisher.",
    descriptionCode: "OrderService",
    starterFile: "order-service.ts",
    starterCode: `class OrderService {
  placeOrder() {
    // ...persist order
    sendEmail()
    sendSMS()
    sendPush()
  }
}`,
    editorFile: "order-service.ts",
    editorCode: `interface Observer {
  update(event: string): void
}

class OrderService {
  private observers: Observer[] = []

  subscribe(o: Observer) {
    this.observers.push(o)
  }

  placeOrder() {
    // ...persist order
    this.observers.forEach((o) => o.update("order.placed"))
  }
}`,
  },
  {
    slug: "build-a-widget-factory",
    title: "Build a Widget Factory",
    category: "Creational",
    difficulty: "Medium",
    summary:
      "Centralize object creation behind a Factory so callers stop newing up concrete classes everywhere.",
    challenge: "The Factory Pattern",
    description:
      "Callers construct {code} subclasses by hand with sprawling if/else blocks. Introduce a Factory so creation logic lives in one place.",
    descriptionCode: "Button",
    starterFile: "widgets.ts",
    starterCode: `function render(kind: string) {
  if (kind === "primary") return new PrimaryButton()
  else if (kind === "ghost") return new GhostButton()
  else if (kind === "danger") return new DangerButton()
}`,
    editorFile: "widgets.ts",
    editorCode: `interface Button {
  render(): void
}

class ButtonFactory {
  private registry: Record<string, () => Button> = {}

  register(kind: string, make: () => Button) {
    this.registry[kind] = make
  }

  create(kind: string): Button {
    return this.registry[kind]()
  }
}`,
  },
  {
    slug: "one-config-to-rule-them-all",
    title: "One Config to Rule Them All",
    category: "Creational",
    difficulty: "Easy",
    summary:
      "Guarantee a single shared instance of app config with a well-behaved Singleton.",
    challenge: "The Singleton Pattern",
    description:
      "Every module creates its own {code}, so settings drift out of sync. Enforce a single shared instance with the Singleton Pattern.",
    descriptionCode: "Config",
    starterFile: "config.ts",
    starterCode: `export class Config {
  values: Record<string, string> = {}
}

// module A
const a = new Config()
// module B
const b = new Config() // different object!`,
    editorFile: "config.ts",
    editorCode: `export class Config {
  private static instance: Config
  values: Record<string, string> = {}

  private constructor() {}

  static get(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }
}`,
  },
  {
    slug: "wrap-the-legacy-api",
    title: "Wrap the Legacy API",
    category: "Structural",
    difficulty: "Medium",
    summary:
      "Make an incompatible third-party client fit your interface with the Adapter Pattern.",
    challenge: "The Adapter Pattern",
    description:
      "A legacy {code} exposes snake_case methods your app cannot call directly. Write an Adapter that presents the interface the rest of the code expects.",
    descriptionCode: "LegacyGateway",
    starterFile: "gateway.ts",
    starterCode: `class LegacyGateway {
  charge_card(cents: number) {
    // ...legacy call
  }
}

// app expects: gateway.pay(amount)`,
    editorFile: "gateway.ts",
    editorCode: `interface PaymentGateway {
  pay(amount: number): void
}

class LegacyGatewayAdapter implements PaymentGateway {
  constructor(private legacy: LegacyGateway) {}

  pay(amount: number) {
    this.legacy.charge_card(Math.round(amount * 100))
  }
}`,
  },
  {
    slug: "decorate-your-coffee",
    title: "Decorate Your Coffee",
    category: "Structural",
    difficulty: "Hard",
    summary:
      "Add behavior to objects at runtime by stacking Decorators instead of subclassing.",
    challenge: "The Decorator Pattern",
    description:
      "Pricing a {code} with every combination of add-ons explodes into dozens of subclasses. Use the Decorator Pattern to compose behavior at runtime.",
    descriptionCode: "Beverage",
    starterFile: "coffee.ts",
    starterCode: `class EspressoWithMilkAndSugar {
  cost() {
    return 2.0 + 0.5 + 0.25
  }
}
// ...and a class for every combination`,
    editorFile: "coffee.ts",
    editorCode: `interface Beverage {
  cost(): number
}

class Espresso implements Beverage {
  cost() {
    return 2.0
  }
}

class MilkDecorator implements Beverage {
  constructor(private inner: Beverage) {}
  cost() {
    return this.inner.cost() + 0.5
  }
}`,
  },
];

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((p) => p.slug === slug);
}
