package com.nagar_sewak.backend.services;


import com.nagar_sewak.backend.entities.Ward;
import com.nagar_sewak.backend.repositories.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
        return Math.sqrt(
                Math.pow(lat1 - lat2, 2) +
                Math.pow(lon1 - lon2, 2)
        );
    }
}
