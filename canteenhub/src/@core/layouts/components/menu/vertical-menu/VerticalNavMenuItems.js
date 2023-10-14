/* eslint-disable import/no-cycle */
// ** Vertical Menu Components
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@layouts/utils';
import VerticalNavMenuLink from './VerticalNavMenuLink';
import VerticalNavMenuGroup from './VerticalNavMenuGroup';
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader';

// ** Utils

const VerticalMenuNavItems = (props) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuSectionHeader,
    VerticalNavMenuGroup,
    VerticalNavMenuLink,
  };

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)];

    return <TagName key={item.id || item.header} item={item} {...props} />;
  });

  return RenderNavItems;
};

export default VerticalMenuNavItems;
