import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async fillUsername(username: string) {
    return this.page.getByTestId('username').fill(username);
  }

  async fillPassword(password: string) {
    return this.page.getByTestId('password').fill(password);
  }

  async clickLogin() {
    return this.page.getByTestId('login-button').click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}

export class InventoryPage {
  constructor(private page: Page) {}

  private itemByTitle(title: string) {
    return this.page
      .getByTestId('inventory-item')
      .filter({ has: this.page.getByTestId('inventory-item-name').getByText(title, { exact: true }) });
  }

  async goToCart() {
    return this.page.getByTestId('shopping-cart-link').click();
  }

  async addToCartByTitle(title: string) {
    return this.itemByTitle(title).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCartByTitle(title: string) {
    return this.itemByTitle(title).getByRole('button', { name: 'Remove' }).click();
  }

  async getPriceByTitle(title: string) {
    return this.itemByTitle(title).getByTestId('inventory-item-price').textContent();
  }

  async checkAbsenceByTitle(title: string) {
    const count = await this.itemByTitle(title).count();
    return count === 0;
  }
}

export class CartPage {
  constructor(private page: Page) {}

  async goToCart() {
    return this.page.getByTestId('shopping-cart-link').click();
  }

  async getCartItemCount() {
    return this.page.locator('.shopping_cart_badge').count();
  }

  async checkout() {
    return this.page.getByTestId('checkout').click();
  }

  async continueShopping() {
    return this.page.getByTestId('continue-shopping').click();
  }
}

export class CheckoutStepOnePage {
  constructor(private page: Page) {}

  fillFirstName(firstName: string) {
    return this.page.getByTestId('firstName').fill(firstName);
  }

  async fillLastName(lastName: string) {
    return this.page.getByTestId('lastName').fill(lastName);
  }

  async fillZipCode(postalCode: string) {
    return this.page.getByTestId('postalCode').fill(postalCode);
  }

  async continue() {
    return this.page.getByTestId('continue').click();
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillZipCode(postalCode);
  }
}

export class CheckoutStepTwoPage {
  constructor(private page: Page) {}

  async finish() {
    return this.page.getByTestId('finish').click();
  }
}
