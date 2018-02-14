import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from '../../shared/models/product';
import 'rxjs/add/operator/take';

@Injectable()
export class ShoppingCartService {

  constructor(private db:AngularFireDatabase) { }

  private create(){
    return this.db.list('/shopping-carts').push({
      dataCreated: new Date().getTime()
    })
  }
  async getCart(){
    let cartId = await this.getOrCreateCart();
    return this.db.object('/shopping-carts/' + cartId);
  }
  
  private async getOrCreateCart(): Promise<string>{
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;

      let result = await this.create();
      localStorage.setItem('cartId', result.key);
      return result.key;
 
  }
  private getItem(cartId:string, productId:string){
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  async addToCart(product:Product){
      this.updateItemQuantity(product, 1);
  }
  async removeFromCart (product:Product){
    this.updateItemQuantity(product, -1)
  }
  private async updateItemQuantity(product: Product, change:number){
      let cartId = await this.getOrCreateCart();
      let item$ = this.getItem(cartId, product.$key);
      item$.take(1).subscribe(item => {
        item$.update({product:product, quantity: (item.quantity || 0)  + change});
        // if(item.$exists()) item$.update({quantity:item.quantity + 1});
        // else item$.set({product:product, quantity:1});
      })
  }

  
  



  // async addToCart(product){
  //   this.updateItem(product, 1);
  // }
  // async removeFromCart(product:Product){
  //   this.updateItem(product, -1)
  // }
  
  // private getItem(cartId:string, productId:string){
  //   return this.db.object('shopping-carts/' + cartId + 'items' + productId);
  // }

  // async updateItem(product:Product, change:number){
  //   let cartId =  await this.getOrCreateCartId();
  //   let item$ = this.getItem(cartId, product.$key);

  //   item$.take(1).subscribe(item => {
  //      let quantity = (item.quantity || 0) + change;
  //      if(quantity === 0) item$.remove();
  //      else item$.update({
  //        title:product.title,
  //        price:product.price,
  //        imageUrl:product.imageUrl,
  //        quantity:quantity
  //      });
  //   })
  // }
  // async getCart(){
  //   let cartId = await this.getOrCreateCartId()
  //   return this.db.object('/shopping-carts/' + cartId);
  // }

  // private async getOrCreateCartId(): Promise<string>{
  //   let cartId = localStorage.getItem('cartId');
  //   if(cartId) return cartId

  //   let result = await this.create();
  //   localStorage.setItem('cartId', result.key);
  //   return result.key;
  // }
  // private create(){
  //   return this.db.list('/shopping-carts').push({
  //     dataCreated: new Date().getTime()
  //   })
  // }


}