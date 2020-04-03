import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import DrawerNavigator from './DrawerNavigator';
import ProductDetail from '../views/ProductDetail';

const AuthNavigator = createSwitchNavigator(
    {
        AuthHomeNavigator: DrawerNavigator,
        ProductDetailRoute: {screen: ProductDetail},
    },
    {
        initialRouteName: 'AuthHomeNavigator',
    }
);

const RootNavigator = createAppContainer(AuthNavigator);

export default RootNavigator;
