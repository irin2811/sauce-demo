import { test, expect } from '@playwright/test';
import { LoginPage, InventoryPage, CartPage, CheckoutStepOnePage, CheckoutStepTwoPage } from './classes';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';
const PRODUCT = 'Sauce Labs Backpack';

test.describe('Sauce Demo Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginPage = new LoginPage(page);
    await loginPage.login(USERNAME, PASSWORD);
  });

  test('Login page', async ({ page }) => {
    await expect(page.locator('.app_logo')).toHaveText('Swag Labs');
  });


  test('Adding item to the cart and verifying title and price', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartByTitle(PRODUCT);
    const priceInTheInventory = await inventoryPage.getPriceByTitle(PRODUCT);

    await inventoryPage.goToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(1);

    const priceInTheCart = await inventoryPage.getPriceByTitle(PRODUCT);
    expect(priceInTheCart).toBe(priceInTheInventory); 
  });

  test('Removing item from the cart and verifying absence', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartByTitle(PRODUCT);
    await inventoryPage.goToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(1);

    await inventoryPage.removeFromCartByTitle(PRODUCT);
    const isAbsent = await inventoryPage.checkAbsenceByTitle(PRODUCT);
    expect(isAbsent).toBe(true);
  });

  test('Continuing shopping from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addToCartByTitle(PRODUCT);
    await inventoryPage.goToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(1);

    const cartPage = new CartPage(page);
    await cartPage.checkout();
    
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await checkoutStepOnePage.fillCheckoutInformation('Test', 'Test', '123');
    console.log('Filling checkout information');
    await checkoutStepOnePage.continue();

    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(PRODUCT);
    console.log('Verifying checkout step two page');
    await expect(page.getByTestId('payment-info-label')).toHaveText('Payment Information:')
    console.log('Verifying payment information');
    await checkoutStepTwoPage.finish();
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
  });
});
