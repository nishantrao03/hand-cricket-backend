const createMatchInvitation =
    require("../tools/createMatchInvitation");

(async () => {

    const result =
        await createMatchInvitation({

            id: "match-10",
            overs: 6,
            wickets: 10
        });

    console.log(result);

})();