import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../product/services/order.service';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  productId:string;
  allData:any;
  
  totalPrices:number;
  

  

  constructor(private route:ActivatedRoute, private orderService:OrderService) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    //console.log('this.productId', this.productId);
    if(this.productId){
      this.orderService.getOrderByProductId(this.productId).subscribe(data => {
        this.allData = data;
        //console.log('this.allData', this.allData);
        this.totalPriceOfProduct(this.allData[1]);
        //console.log('this.userId', this.userId);
      })
    }
    
  }
  private totalPriceOfProduct(priceArray:any){
    this.totalPrices = 0;
    for(let item of priceArray){
      this.totalPrices+= item.totalPrice;
    }
  }

}
