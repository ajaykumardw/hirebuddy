const hoMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/head-office/dashboard'
  },
  {
    label: 'Jobs',
    icon: 'tabler-briefcase',
    children: [
      {
        label: 'View Jobs',
        icon: 'tabler-circle',
        href: '/head-office/jobs/list'
      },
      {
        label: 'Job Post',
        icon: 'tabler-circle',
        href: '/head-office/jobs/add'
      }
    ]
  },
  {
    label: 'Locations',
    icon: 'tabler-map',
    href: '/head-office/locations'
  },
]

export default hoMenuData
