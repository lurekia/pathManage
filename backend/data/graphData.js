export const data = {
    nodes: [      
        {
            id: 'n0',
            label: '济南',
            desc: '泉城，历史悠久，以千佛山、趵突泉著称',
            x: 182,
            y: 187,
        },
        {
            label: '青岛',
            id: 'n1',
            desc: '海滨城市，啤酒之都，建筑风格独特',
            x: 511,
            y: 260,
        },
        {	
            label: '烟台',
            id: 'n2',
            desc: '美丽海滨城市，渔业发达，海鲜丰富',
            x: 585,
            y: 64
        },	
        {
            label: '潍坊',
            id: 'n3',
            desc: '书法之乡，潍坊梨、草编工艺传统特色',
            x: 409,
            y: 179
        },	
        {
            label: '临沂',
            id: 'n4',
            desc: '全国重要的商品粮生产基地，山水秀丽',
            x: 338,
            y: 394
        },
        {	
            label: '枣庄',
            id: 'n5',
            desc: '古迹众多，是中国十大古都之一，国家园林城市，濒临黄河，享有自然风光',
            x: 242,
            y: 445
        },	
        {
            label: '济宁',
            id: 'n6',
            desc: '京杭大运河的穿境之地，历史悠久，以曲阜孔庙、孔林著称',
            x: 147,
            y: 352
        },	
        {
            label: '淄博',
            id: 'n7',
            desc: '陶都，历史悠久，陶瓷文化源远流长',
            x: 285,
            y: 173
        },	
        {
            label: '泰安',
            id: 'n8',
            desc: '泰山之城，世界文化与自然双遗产地',
            x: 190,
            y: 259
        },
        {
            label: '威海',
            id: 'n9',
            desc: '环海城市，天然良港，风景宜人',
            x: 669,
            y: 50,
        },
        {
            label: '德州',
            id: 'n10',
            desc: '孟母教子文化，历史悠久，文学底蕴深厚',
            x: 122,
            y: 88
        },
        {
            label: '菏泽',
            id: 'n11',
            desc: '牡丹之乡，丰富的乡村文化和地方传统艺术',
            x: 35,
            y: 353
        },
        {	
            label: '莱芜',
            id: 'n12',
            desc: '钢铁城市，有着丰富的工业历史和文化',
            x: 287,
            y: 277
        },
        {	
            label: '滨州',
            id: 'n13',
            desc: '千年古邑，非物质文化遗产众多',
            x: 273,
            y: 79
        },
        {
            label: '东营',
            id: 'n14',
            desc: '渤海明珠，油城，盐城，海港城市',
            x: 351,
            y: 52
        },
        {
            label: '聊城',
            id: 'n15',
            desc: '孔孟之乡，历史悠久，文学传统深厚',
            x: 61,
            y: 178
        },
        {
            label: '日照',
            id: 'n16',
            desc: '蓝色硅谷，海洋新城，光伏产业基地',
            x: 451,
            y: 352
        },
    ],

    edges: [
        {
            id: 'e0',
            source: 'n0',
            target: 'n15',
            data: {
                desc: '',
                cost: 109,
                time: 1.1,
                dist: 200,
            }
        },
        {
            id: 'e1',
            source: 'n0',
            target: 'n10',
            data: {
                desc: 'A-C路径',
                cost: 127,
                time: 1.3,
                dist: 270,
            }
        },
        {
            id: 'e2',
            source: 'n0',
            target: 'n8',
            data: {
                desc: 'B-C路径',
                cost: 85,
                time: 0.8,
                dist: 120,
            }
        },
        {
            id: 'e3',
            source: 'n0',
            target: 'n7',
            data: {
                desc: 'B-D路径',
                cost: 147,
                time: 1.8,
                dist: 140,
            }
        },
        {
            id: 'e4',
            source: 'n7',
            target: 'n3',
            data: {
                desc: 'C-E路径',
                cost: 156,
                time: 1.8,
                dist: 150,
            }
        },
        {
            id: 'e5',
            source: 'n3',
            target: 'n1',
            data: {
                desc: 'D-E路径',
                cost: 127,
                time: 1.5,
                dist: 90,
            }
        },
        {
            id: 'e6',
            source: 'n15',
            target: 'n11',
            data: {
                desc: 'D-E路径',
                cost: 208,
                time: 2.0,
                dist: 190,
            }
        },
        {
            id: 'e7',
            source: 'n11',
            target: 'n6',
            data: {
                desc: 'D-E路径',
                cost: 100,
                time: 1,
                dist: 90,
            }
        },
        {
            id: 'e8',
            source: 'n6',
            target: 'n4',
            data: {
                desc: 'D-E路径',
                cost: 186,
                time: 1.9,
                dist: 220,
            }
        },
        {
            id: 'e9',
            source: 'n4',
            target: 'n16',
            data: {
                desc: 'D-E路径',
                cost: 186,
                time: 1.9,
                dist: 220,
            }
        },
        {
            id: 'e10',
            source: 'n16',
            target: 'n1',
            data: {
                desc: 'D-E路径',
                cost: 117,
                time: 1.4,
                dist: 100,
            }
        },
        {
            id: 'e11',
            source: 'n1',
            target: 'n2',
            data: {
                desc: 'D-E路径',
                cost: 95,
                time: 0.9,
                dist: 160,
            }
        },
        {
            id: 'e12',
            source: 'n2',
            target: 'n9',
            data: {
                desc: 'D-E路径',
                cost: 87,
                time: 0.8,
                dist: 200,
            }
        },

        {
            id: 'e13',
            source: 'n2',
            target: 'n14',
            data: {
                desc: 'D-E路径',
                cost: 206,
                time: 2.1,
                dist: 185,
            }
        },
        {
            id: 'e14',
            source: 'n14',
            target: 'n13',
            data: {
                desc: 'D-E路径',
                cost: 80,
                time: 0.8,
                dist: 105,
            }
        },
        {
            id: 'e15',
            source: 'n13',
            target: 'n10',
            data: {
                desc: 'D-E路径',
                cost: 196,
                time: 1.7,
                dist: 180,
            }
        },
        {
            id: 'e16',
            source: 'n8',
            target: 'n5',
            data: {
                desc: 'D-E路径',
                cost: 230,
                time: 2.3,
                dist: 198,
            }
        },
        {
            id: 'e17',
            source: 'n12',
            target: 'n7',
            data: {
                desc: 'D-E路径',
                cost: 154,
                time: 0.8,
                dist: 162,
            }
        },
        {
            id: 'e18',
            source: 'n9',
            target: 'n1',
            data: {
                desc: 'D-E路径',
                cost: 90,
                time: 1.5,
                dist: 275,
            }
        },
    ]
}