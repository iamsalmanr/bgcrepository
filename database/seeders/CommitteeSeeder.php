<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommitteeMember;

class CommitteeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommitteeMember::truncate();

        $defaultImage = 'https://ui-avatars.com/api/?background=random&name=Member'; 
        // I will just use a UI avatar link as placeholder, which the user can edit later.

        $members = [
            // Executive Committee
            ['committee' => 'Executive Committee', 'designation' => 'President', 'name' => 'Major General Towhidul Ahmed, ndc, afwc, psc General officer commanding, 11 Infantry division.'],
            ['committee' => 'Executive Committee', 'designation' => 'Vice President', 'name' => 'Brigadier General Md Shohrab Hossain, BGOM, psc, (retired), Chief Executive Officer, Army Medical College, Bogura.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General S M Sazzad Hossain, BSP, SPP, PPM, afwc, psc, Comd 93 Armoured Brigade.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Shahriar Jabed Chowdhury, hdmc, afwc, psc, G, Commander, 11 Artillery Brigade.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Md Tanvir Hossan, psc Commander, 26 Infantry Brigade.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Zahidur Rahman, afwc, psc, Commander, 111 Infantry Brigade.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Md Habibur Rahman, SGP, PPM, afwc, psc, Commander, 30 Infantry Brigade.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Md Ahsan Habib, SUP, ndc, psc Commandant, JCO NCO Academy.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Hasnat Ahmed, SPP, psc, Commandant, Armoured Corps Center and School.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Brigadier General Md Rezaul Karim, Station Commander, Station Headquarters, Bogura.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Mohammad Sarwar Alam, psc, AA&QMG, Armoured Corps Center and School (Record Wing)'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Tanvir Ahmed, psc, Commander, Military Engineering Service.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'CEO, Cantonment Board.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Md Nazrul Islam Salim, Proprietor, Red Chilies'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Dr. Md Matiur Rahman, Deputy Executive Director, TMSS Medical College.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member', 'name' => 'Tarif Mohammad Apon, Owner, AT Fisheries.'],

            // Development Committee
            ['committee' => 'Development Committee', 'designation' => 'Chairman', 'name' => 'Brigadier General Md Rezaul Karim, Station Commander, Station Headquarters, Bogura.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Tanvir Ahmed, psc, Commander, Military Engineering Service.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Mohammad Saidur Rahman, CEME, 11 Infantry Division.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Md Mamunur Rashid Rassel, psc, Commanding Officer, 4 Engineer Battalion.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Major Md Lutful Hadi, Station Staff Officer, Station Headquarters, Bogura.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Major Sabbir Adnan, GE (Army), Bogura.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Md Waliur Rahman, PD SASEC.'],
            ['committee' => 'Development Committee', 'designation' => 'Member', 'name' => 'Dr. Md Khursid Alam, Civil Surgeon.'],

            // Tournament Committee
            ['committee' => 'Tournament Committee', 'designation' => 'Chairman', 'name' => 'Brigadier General S M Sazzad Hossain, BSP, SPP, PPM, afwc, psc, Commander 93 Armoured Brigade.'],
            ['committee' => 'Tournament Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Mohammad Sarwar Alam, psc, AA&QMG, Armoured Corps Center and School (Record Wing).'],
            ['committee' => 'Tournament Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.'],
            ['committee' => 'Tournament Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal.'],
            ['committee' => 'Tournament Committee', 'designation' => 'Member', 'name' => 'Dr. Md Matiur Rahman, Deputy Executive Director, TMSS Medical College.'],
            ['committee' => 'Tournament Committee', 'designation' => 'Member', 'name' => 'Tarif Mohammad Apon, Owner, AT Fisheries.'],

            // Entertainment & Cultural Committee
            ['committee' => 'Entertainment & Cultural Committee', 'designation' => 'Chairman', 'name' => 'Brigadier General Md Tanvir Hossan, psc, Commander, 26 Infantry Brigade.'],
            ['committee' => 'Entertainment & Cultural Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Shahreen Tabassum Disha, psc, Commanding Officer, 4 Signal Battalion.'],
            ['committee' => 'Entertainment & Cultural Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Abdullah Al Mamun, psc, Armoured Corps Center and School.'],
            ['committee' => 'Entertainment & Cultural Committee', 'designation' => 'Member', 'name' => 'Lt Col Walid Mohammad Saifullah, PBGM, psc, G, JCO NCO Academy.'],

            // Audit & Finance Committee
            ['committee' => 'Audit & Finance Committee', 'designation' => 'Chairman', 'name' => 'Brigadier General Md Habibur Rahman, SGP, PPM, afwc, psc, 30 Infantry Brigade.'],
            ['committee' => 'Audit & Finance Committee', 'designation' => 'Member', 'name' => 'Colonel Abu Reza Mohammad Nasiruddin Ekram, BGBM, psc, Colonel Admin, Area Headquarters Bogura.'],
            ['committee' => 'Audit & Finance Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal and later on, Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.'],

            // Discipline Committee
            ['committee' => 'Discipline Committee', 'designation' => 'Chairman', 'name' => 'Brigadier General Md Ahsan Habib, SUP, ndc, psc, Commandant, JCO NCO Academy.'],
            ['committee' => 'Discipline Committee', 'designation' => 'Member', 'name' => 'Colonel Mohammad Manirul Hossain, psc, G, Colonel GS, Directorate General of Forces Intelligence, Bogura.'],
            ['committee' => 'Discipline Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Md Arif Rahman, psc, G+ Commanding Officer, Army Security Unit, Bogura.'],
            ['committee' => 'Discipline Committee', 'designation' => 'Member', 'name' => 'Major Tanzim Hasan Rahat, Officer Commanding, 11 Field Intelligence Unit.'],

            // Special Designations (Grouped as Executive Committee for now to show on the site)
            ['committee' => 'Executive Committee', 'designation' => 'Treasurer', 'name' => 'Colonel Abu Reza Mohammad Nasiruddin Ekram, BGBM, psc, Colonel Admin, Area Headquarters, Bogura.'],
            ['committee' => 'Handicap Committee', 'designation' => 'Member', 'name' => 'Lieutenant Colonel Mohammad Sarwar Alam, psc AA&QMG, Armoured Corps Center and School (Record Wing).'],
            ['committee' => 'Executive Committee', 'designation' => 'Golf Captain', 'name' => 'Lieutenant Colonel Mohammad Sarwar Alam, psc AA&QMG, Armoured Corps Center and School (Record Wing).'],
            ['committee' => 'Executive Committee', 'designation' => 'Lady Golf Captain', 'name' => 'Mrs. Afrin Ahsan, spouse of Mr. Tariq Mohammad Apon.'],
            ['committee' => 'Executive Committee', 'designation' => 'Member Secretary', 'name' => 'Lieutenant Colonel Golam Moula Sagor, psc, Commanding Officer, 12 East Bengal and later on, Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal.'],
            ['committee' => 'Executive Committee', 'designation' => 'Assistant Member Secretary', 'name' => 'Lieutenant Colonel Md Hasan Hafizur Rahman, psc, Commanding Officer, 67 East Bengal (will take over as Member Secretary subsequently)'],
        ];

        $order = 1;
        foreach ($members as $member) {
            CommitteeMember::create([
                'committee' => $member['committee'],
                'designation' => $member['designation'],
                'name' => $member['name'],
                'image_path' => null,
                'sort_order' => $order++
            ]);
        }
    }
}
