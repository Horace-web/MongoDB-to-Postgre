import { User } from './entities/User';
import { Product } from './entities/Product';
import { Order } from './entities/Order';

console.log('✅ Imports réussis !');
console.log('Classes disponibles:', {
    User: !!User,
    Product: !!Product,
    Order: !!Order
});