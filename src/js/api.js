
export default {
    send: (options) => {
        // fetch({
        //     method:"post",
        //     url: options.url,
        // })
        fetch(options.url, {
            method: 'post',
            body: JSON.stringify(options.data),
            headers: {
                'content-type': 'application/json',
            },
        }).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Fetch error: ${res.statusText}`);
            }
        }).then(response => {
            const data = response;
            if (!data || data.code !== 0) {
                options.error && options.error(data && data.msg);
                return;
            }
            options.success && options.success(data);
        }).catch((e) => {
            console.error(e);
            options.error && options.error();
        });

    },

    read: (options) => {
        fetch(options.url).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Fetch error: ${res.statusText}`);
            }

        }).then((response) => {
            const data = response;
            if (!data || data.code !== 0) {
                options.error && options.error(data && data.msg);
                return;
            }
            options.success &&
            options.success(
                data.data.map((item) => ({
                    time: item[0],
                    type: item[1],
                    color: item[2],
                    author: item[3],
                    text: item[4],
                })),
            );
        }).catch((e) => {
            console.error(e);
            options.error && options.error();
        });
        // axios
        //     .get(options.url)
        //     .then((response) => {
        //         const data = response.data;
        //         if (!data || data.code !== 0) {
        //             options.error && options.error(data && data.msg);
        //             return;
        //         }
        //         options.success &&
        //         options.success(
        //             data.data.map((item) => ({
        //                 time: item[0],
        //                 type: item[1],
        //                 color: item[2],
        //                 author: item[3],
        //                 text: item[4],
        //             })),
        //         );
        //     })
        //     .catch((e) => {
        //         console.error(e);
        //         options.error && options.error();
        //     });
    },
};
