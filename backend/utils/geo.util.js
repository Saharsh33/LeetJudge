import http from 'http';

/**
 * Uses a free IP geolocation API to determine the city, region, and country of an IP address.
 * @param {string} ip The IP address to geolocate.
 * @returns {Promise<string>} A formatted string like "Valsad, Gujarat, India" or "Unknown Region".
 */
export const getLocationFromIP = (ip) => {
    return new Promise((resolve) => {
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            // Localhost or private networks cannot be geolocated publicly
            resolve('Local Network (Development)');
            return;
        }

        // ip-api is free for non-commercial use, no API key required, 45 requests/minute
        http.get(`http://ip-api.com/json/${ip}`, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.status === 'success') {
                        // Format: City, Region, Country
                        resolve(`${parsed.city}, ${parsed.regionName}, ${parsed.country}`);
                    } else {
                        resolve('Unknown Region');
                    }
                } catch (error) {
                    resolve('Unknown Region');
                }
            });
        }).on('error', (err) => {
            resolve('Unknown Region');
        });
    });
};
