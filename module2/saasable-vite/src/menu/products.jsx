/***************************  MENU ITEMS - PRODUCTS  ***************************/

const products = {
  id: 'group-products',
  title: 'Product',
  icon: 'IconBasket',
  type: 'group',
  children: [
    {
      id: 'products-collapse',
      title: 'Product',
      type: 'collapse',
      icon: 'IconShoppingBag',
      children: [
        {
          id: 'list-product',
          title: 'List Product',
          type: 'item',
          url: '/products/list-product'
        }
      ]
    }
  ]
};

export default products;
