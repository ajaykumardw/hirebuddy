const adminMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/admin/dashboard'
  },
  {
    label: 'Branch',
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/admin/branch/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/admin/branch/add'
      }
    ]
  },
  {
    label: 'HO',
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/admin/ho/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/admin/ho/add'
      }
    ]
  },
  {
    label: 'Locations',
    icon: 'tabler-map',
    href: '/admin/locations'
  }
]

export default adminMenuData
