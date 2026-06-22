const fetchMatchInvitation =
    require("../tools/fetchMatchInvitation");

(async () => {

    const result =
        await fetchMatchInvitation({

            id:
                "match-10"
        });

    console.log(result);

})();