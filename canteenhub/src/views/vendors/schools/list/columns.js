
// ** Renders Role Columns
// const renderRole = (row) => {
//   const roleObj = {
//     customer: {
//       class: 'light-primary',
//       icon: User,
//     },
//     school: {
//       class: 'light-success',
//       icon: Database,
//     },
//     group: {
//       class: 'light-info',
//       icon: Edit2,
//     },
//     vendor: {
//       class: 'light-warning',
//       icon: Settings,
//     },
//     admin: {
//       class: 'light-danger',
//       icon: Slack,
//     },
//   };

//   return (
//     <span className="text-truncate text-capitalize align-middle">
//       <Badge color={`${roleObj[row.role] ? roleObj[row.role].class : ''}`} pill>
//         {row.role}
//       </Badge>
//     </span>
//   );
// };

export const columns = [
  {
    name: 'School',
    selector: (row) => `${row.companyName}`,
  },
  {
    name: 'Contact',
    selector: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    name: 'Contact Email',
    minWidth: '300px',
    selector: (row) => row.email,
  },
  // {
  //   name: 'Role',
  //   sortable: true,
  //   cell: (row) => renderRole(row),
  // },
];
