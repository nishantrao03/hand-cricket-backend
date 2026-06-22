const deleteMatchInvitation =
    require("../tools/deleteMatchInvitation");

(async () => {

    const result =
        await deleteMatchInvitation({

            id:
                "match-10"
        });

    console.log(result);

})();