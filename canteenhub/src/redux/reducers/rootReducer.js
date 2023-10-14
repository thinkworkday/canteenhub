// ** Redux Imports
import { combineReducers } from 'redux';

// ** Reducers Imports
// import users from '@src/views/user/store/reducer';
import auth from './auth';
import navbar from './navbar';
import layout from './layout';
import users from './user';
import profiles from './profile';
import orders from './order';
import orderNotes from './orderNotes';
import cart from './cart';
import events from './event';
import groups from './group';
import stores from './store';
import invites from './invite';
import records from './records'; // general DB records
import media from './media';
import menus from './menu';
import transactions from './transactions';
import testModes from './testModes';
import orderFilter from './orderFilter';
import orderNotesPending from './orderNotesPending';
import marketContents from './marketContent';
import marketWorks from './marketWork';
import marketSchools from './marketSchool';
import marketProvides from './marketProvide';
import marketPartners from './marketPartner';
import marketSiteSchools from './marketSiteSchool';
import marketSiteWorks from './marketSiteWork';
import marketSitePartners from './marketSitePartner';
import marketSiteProvides from './marketSiteProvide';
import marketSiteLandContent from './marketSiteLandContent';
import marketSiteParentContent from './marketSiteParentContent';
import marketSiteSchoolContent from './marketSiteSchoolContent';
import marketSiteStoreContent from './marketSiteStoreContent';
import newsletter from './newsletter';
import newsletterView from './newsletterView';
import marketFeedbacks from './marketFeedback';
import marketSiteFeedbacks from './marketSiteFeedback';

const rootReducer = combineReducers({
  auth,
  navbar,
  layout,
  orders,
  orderNotes,
  orderNotesPending,
  cart,
  events,
  users,
  profiles,
  groups,
  stores,
  invites,
  records,
  media,
  menus,
  transactions,
  testModes,
  orderFilter,
  marketContents,
  marketWorks,
  marketSchools,
  marketProvides,
  marketPartners,
  marketSiteSchools,
  marketSiteWorks,
  marketSiteProvides,
  marketSitePartners,
  marketSiteLandContent,
  marketSiteParentContent,
  marketSiteSchoolContent,
  marketSiteStoreContent,
  newsletter,
  newsletterView,
  marketFeedbacks,
  marketSiteFeedbacks,
});

export default rootReducer;
