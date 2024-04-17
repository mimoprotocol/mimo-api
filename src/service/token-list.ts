import { getTokenFromPlatforms } from "../lib/token";


export default async function handler(context: any) {
    try {
        const { req, res } = context;
        const { platform } = req.param();
        const arr = await getTokenFromPlatforms(platform)

        const datas = {
            name: 'Mimo Token List',
            timestamp: '2021-03-17T09:56:23Z',
            version: {
                major: 2,
                minor: 10,
                patch: 0,
            },
            tags: {},
            logoURI: 'https://swap.mimo.exchange/images/logo.png',
            keywords: ['mimoswap', 'default'],
            tokens: [] as any[],
        };

        datas.tokens = arr.map((item: any) => {
            item.logoURI = item.logo;
            return item;
        });

        return context.json(datas);
    } catch (err) {
        console.error(err)
        return context.json([]);
    }
}