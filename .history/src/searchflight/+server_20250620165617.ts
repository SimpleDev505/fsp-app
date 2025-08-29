import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import axios from "axios";

const CLIENT_ID = import.meta.env.OPENSKY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.OPENSKY_CLIENT_SECRET;

export const POST: RequestHandler = async ({ request }) => {
    try {
        // 1. Get SearchFilter from frontend
        const searchFilter = await request.json();
        console.log("Received search filter:", searchFilter);

        // 2. Get access token from OpenSky
        const tokenRes = await axios.post(
            "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token",
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            },
        );
        const token = tokenRes.data.access_token;

        // 3. Fetch OpenSky data
        const openskyRes = await axios.get(
            "https://opensky-network.org/api/states/all",
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );

        const { states, time } = openskyRes.data;

        // 4. Filter flights based on origin/destination match (very basic example)
        const fromCity = searchFilter.timings[0].from.toLowerCase();
        const toCity = searchFilter.timings[0].to.toLowerCase();
        const airlineFilter = searchFilter.extra?.airlines?.toLowerCase() || "";

        const filtered = states.filter((s: any[]) => {
            const originCountry = s[2]?.toLowerCase() || "";
            const callsign = s[1]?.toLowerCase() || "";
            return (
                originCountry.includes(fromCity) ||
                originCountry.includes(toCity) ||
                callsign.includes(airlineFilter)
            );
        });

        // 5. Return filtered data
        return json({ time, states: filtered });
    } catch (err: any) {
        console.error("Server error:", err.message);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
};
