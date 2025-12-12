package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.Ward;
import com.nagar_sewak.backend.repositories.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.lang.Math.*;

@Service
@RequiredArgsConstructor
public class WardService {

    private final WardRepository wardRepository;

    public Ward detectWard(double lat, double lng) {
        List<Ward> wards = wardRepository.findAll();
        Ward nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (Ward ward : wards) {
            double distance = calculateDistance(lat, lng, ward.getLatitude(), ward.getLongitude());
            if (distance < minDistance) {
                minDistance = distance;
                nearest = ward;
            }
        }
        return nearest;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in kilometers
        double latDistance = toRadians(lat2 - lat1);
        double lonDistance = toRadians(lon2 - lon1);

        double a = sin(latDistance / 2) * sin(latDistance / 2)
                + cos(toRadians(lat1)) * cos(toRadians(lat2))
                * sin(lonDistance / 2) * sin(lonDistance / 2);

        double c = 2 * atan2(sqrt(a), sqrt(1 - a));

        return R * c; // distance in km
    }
}