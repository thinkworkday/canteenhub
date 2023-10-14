// ** Menu Components Imports
import { resolveHorizontalNavMenuItemComponent as resolveNavItemComponent } from '@layouts/utils';
import HorizontalNavMenuLink from './HorizontalNavMenuLink';
// eslint-disable-next-line import/no-cycle
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup';

const HorizontalNavMenuItems = (props) => {
  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink,
  };

  // ** Render Nav Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)];

    return <TagName item={item} index={index} key={item.id} {...props} />;
  });

  return RenderNavItems;
};

export default HorizontalNavMenuItems;
